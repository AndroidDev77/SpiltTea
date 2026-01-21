import React, { useState, useCallback } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Input,
  Card,
  Text,
  Button,
  Spinner,
  Badge,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Field,
  Select,
} from '@fluentui/react-components';
import {
  Search24Regular,
  Add24Regular,
  Dismiss24Regular,
  Person24Regular,
  CheckmarkCircle24Filled,
} from '@fluentui/react-icons';
import { useSearchPersons, useCreatePerson } from '../../hooks/usePersons';
import type { Person, Gender, CreatePersonRequest } from '../../types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  searchContainer: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  searchInput: {
    flex: 1,
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    maxHeight: '300px',
    overflowY: 'auto',
  },
  personCard: {
    ...shorthands.padding('12px'),
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  personCardSelected: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    ...shorthands.borderWidth('2px'),
  },
  personInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  avatar: {
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: tokens.colorNeutralBackground5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  personDetails: {
    flex: 1,
  },
  personName: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    fontWeight: tokens.fontWeightSemibold,
  },
  verifiedIcon: {
    color: tokens.colorPaletteGreenForeground1,
    fontSize: '16px',
  },
  personMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  selectedPerson: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderRadius('8px'),
  },
  selectedInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  noResults: {
    ...shorthands.padding('16px'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('16px'),
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
});

interface PersonSelectorProps {
  value?: Person | null;
  onChange: (person: Person | null) => void;
  label?: string;
}

export const PersonSelector: React.FC<PersonSelectorProps> = ({
  value,
  onChange,
  label = 'Person',
}) => {
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPerson, setNewPerson] = useState<CreatePersonRequest>({
    name: '',
    aliases: [],
    approximateAge: undefined,
    gender: undefined,
    city: '',
    state: '',
    country: 'USA',
  });

  const { data: searchResults, isLoading } = useSearchPersons(searchQuery);
  const createPersonMutation = useCreatePerson();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSelectPerson = useCallback((person: Person) => {
    onChange(person);
    setSearchQuery('');
  }, [onChange]);

  const handleClearSelection = useCallback(() => {
    onChange(null);
  }, [onChange]);

  const handleCreatePerson = async () => {
    if (!newPerson.name.trim()) return;

    try {
      const createdPerson = await createPersonMutation.mutateAsync(newPerson);
      onChange(createdPerson);
      setIsDialogOpen(false);
      setSearchQuery('');
      setNewPerson({
        name: '',
        aliases: [],
        approximateAge: undefined,
        gender: undefined,
        city: '',
        state: '',
        country: 'USA',
      });
    } catch (error) {
      console.error('Failed to create person:', error);
    }
  };

  const formatLocation = (person: Person) => {
    const parts = [person.city, person.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  // If a person is selected, show the selection
  if (value) {
    return (
      <div className={styles.container}>
        <Text weight="semibold">{label}</Text>
        <div className={styles.selectedPerson}>
          <div className={styles.selectedInfo}>
            <div className={styles.avatar}>
              {value.profileImageUrl ? (
                <img src={value.profileImageUrl} alt={value.name} className={styles.avatarImage} />
              ) : (
                <Person24Regular />
              )}
            </div>
            <div>
              <div className={styles.personName}>
                <span>{value.name}</span>
                {value.isVerified && <CheckmarkCircle24Filled className={styles.verifiedIcon} />}
              </div>
              {formatLocation(value) && (
                <Text className={styles.personMeta}>{formatLocation(value)}</Text>
              )}
            </div>
          </div>
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={handleClearSelection}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Text weight="semibold">{label}</Text>
      <div className={styles.searchContainer}>
        <Input
          className={styles.searchInput}
          placeholder="Search for a person..."
          contentBefore={<Search24Regular />}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="outline" icon={<Add24Regular />}>
              New
            </Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Add New Person</DialogTitle>
              <DialogContent>
                <div className={styles.formGrid}>
                  <Field label="Name" required className={styles.fullWidth}>
                    <Input
                      value={newPerson.name}
                      onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                      placeholder="Full name"
                    />
                  </Field>
                  <Field label="Approximate Age">
                    <Input
                      type="number"
                      value={newPerson.approximateAge?.toString() || ''}
                      onChange={(e) =>
                        setNewPerson({
                          ...newPerson,
                          approximateAge: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="Age"
                    />
                  </Field>
                  <Field label="Gender">
                    <Select
                      value={newPerson.gender || ''}
                      onChange={(_, data) =>
                        setNewPerson({
                          ...newPerson,
                          gender: (data.value as Gender) || undefined,
                        })
                      }
                    >
                      <option value="">Select...</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="NON_BINARY">Non-binary</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </Select>
                  </Field>
                  <Field label="City">
                    <Input
                      value={newPerson.city || ''}
                      onChange={(e) => setNewPerson({ ...newPerson, city: e.target.value })}
                      placeholder="City"
                    />
                  </Field>
                  <Field label="State">
                    <Input
                      value={newPerson.state || ''}
                      onChange={(e) => setNewPerson({ ...newPerson, state: e.target.value })}
                      placeholder="State"
                    />
                  </Field>
                </div>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancel</Button>
                </DialogTrigger>
                <Button
                  appearance="primary"
                  onClick={handleCreatePerson}
                  disabled={!newPerson.name.trim() || createPersonMutation.isPending}
                >
                  {createPersonMutation.isPending ? 'Creating...' : 'Create Person'}
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>

      {searchQuery && (
        <div className={styles.resultsContainer}>
          {isLoading ? (
            <Spinner size="small" label="Searching..." />
          ) : searchResults && searchResults.persons.length > 0 ? (
            searchResults.persons.map((person) => (
              <Card
                key={person.id}
                className={styles.personCard}
                onClick={() => handleSelectPerson(person)}
              >
                <div className={styles.personInfo}>
                  <div className={styles.avatar}>
                    {person.profileImageUrl ? (
                      <img
                        src={person.profileImageUrl}
                        alt={person.name}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <Person24Regular />
                    )}
                  </div>
                  <div className={styles.personDetails}>
                    <div className={styles.personName}>
                      <span>{person.name}</span>
                      {person.isVerified && (
                        <CheckmarkCircle24Filled className={styles.verifiedIcon} />
                      )}
                    </div>
                    <div className={styles.personMeta}>
                      {formatLocation(person) && <span>{formatLocation(person)}</span>}
                      {person._count?.posts !== undefined && (
                        <Badge appearance="outline" size="small">
                          {person._count.posts} {person._count.posts === 1 ? 'review' : 'reviews'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className={styles.noResults}>
              <Text>No people found. Click "New" to add someone.</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
