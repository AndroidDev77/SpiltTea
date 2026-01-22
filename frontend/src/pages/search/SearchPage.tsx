import React, { useState, useCallback } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Button,
  Input,
  Spinner,
  Badge,
  Field,
} from '@fluentui/react-components';
import {
  Search24Regular,
  Person24Regular,
  CheckmarkCircle24Filled,
  Location24Regular,
  Phone24Regular,
  Filter24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { useSearchPersons } from '../../hooks/useSearch';
import type { PersonSearchFilters } from '../../types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  title: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },
  searchCard: {
    ...shorthands.padding('24px'),
    ...shorthands.borderRadius('16px'),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  mainSearch: {
    display: 'flex',
    ...shorthands.gap('12px'),
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
  },
  filtersToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  filtersLabel: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...shorthands.gap('16px'),
    marginBottom: '16px',
  },
  activeFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('8px'),
    marginTop: '12px',
  },
  filterChip: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    ...shorthands.padding('4px', '12px'),
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    ...shorthands.borderRadius('16px'),
    fontSize: tokens.fontSizeBase200,
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  personCard: {
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius('16px'),
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
  },
  personInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('16px'),
  },
  avatar: {
    width: '64px',
    height: '64px',
    ...shorthands.borderRadius('16px'),
    backgroundColor: tokens.colorNeutralBackground5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: tokens.fontSizeBase600,
    flexShrink: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  personDetails: {
    flex: 1,
    minWidth: 0,
  },
  personName: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '6px',
  },
  verifiedIcon: {
    color: tokens.colorPaletteBlueForeground2,
    fontSize: '18px',
  },
  personMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('16px'),
    marginBottom: '12px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  personStats: {
    display: 'flex',
    ...shorthands.gap('8px'),
    alignItems: 'center',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('60px'),
    ...shorthands.gap('16px'),
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    ...shorthands.padding('60px', '24px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('16px'),
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    maxWidth: '400px',
  },
});

export const SearchPage: React.FC = () => {
  const styles = useStyles();
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PersonSearchFilters>({});
  const [activeFilters, setActiveFilters] = useState<PersonSearchFilters>({});
  const [hasSearched, setHasSearched] = useState(false);

  const { data: results, isLoading } = useSearchPersons(activeFilters);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const newFilters: PersonSearchFilters = {
      ...filters,
      query: searchQuery || undefined,
    };
    setActiveFilters(newFilters);
    setHasSearched(true);
  }, [filters, searchQuery]);

  const handleFilterChange = useCallback((field: keyof PersonSearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  }, []);

  const handleRemoveFilter = useCallback((field: keyof PersonSearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setActiveFilters({});
    setSearchQuery('');
    setHasSearched(false);
  }, []);

  const formatLocation = (city?: string, state?: string) => {
    const parts = [city, state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(Boolean).length;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Find People</Text>
        <Text className={styles.subtitle}>
          Search for people by name, phone number, location, or social media handles
        </Text>
      </div>

      <Card className={styles.searchCard}>
        <form onSubmit={handleSearch}>
          <div className={styles.mainSearch}>
            <Input
              className={styles.searchInput}
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              contentBefore={<Search24Regular />}
              size="large"
            />
            <Button appearance="primary" type="submit" size="large">
              Search
            </Button>
          </div>

          <div className={styles.filtersToggle}>
            <div className={styles.filtersLabel}>
              <Filter24Regular />
              <span>Advanced Filters</span>
              {getActiveFilterCount() > 0 && (
                <Badge appearance="filled" color="brand" size="small">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </div>
            <Button
              appearance="subtle"
              size="small"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showFilters && (
            <div className={styles.filtersGrid}>
              <Field label="Name">
                <Input
                  placeholder="First or last name"
                  value={filters.name || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </Field>
              <Field label="Phone Number">
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={filters.phoneNumber || ''}
                  onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                />
              </Field>
              <Field label="City">
                <Input
                  placeholder="City name"
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
              </Field>
              <Field label="State">
                <Input
                  placeholder="State"
                  value={filters.state || ''}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                />
              </Field>
              <Field label="Twitter Handle">
                <Input
                  placeholder="@username"
                  value={filters.twitterHandle || ''}
                  onChange={(e) => handleFilterChange('twitterHandle', e.target.value)}
                />
              </Field>
              <Field label="Instagram Handle">
                <Input
                  placeholder="@username"
                  value={filters.igHandle || ''}
                  onChange={(e) => handleFilterChange('igHandle', e.target.value)}
                />
              </Field>
              <Field label="TikTok Handle">
                <Input
                  placeholder="@username"
                  value={filters.tiktokHandle || ''}
                  onChange={(e) => handleFilterChange('tiktokHandle', e.target.value)}
                />
              </Field>
            </div>
          )}

          {getActiveFilterCount() > 0 && (
            <div className={styles.activeFilters}>
              {activeFilters.query && (
                <span className={styles.filterChip}>
                  Search: {activeFilters.query}
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Dismiss24Regular />}
                    onClick={() => {
                      setSearchQuery('');
                      handleRemoveFilter('query');
                    }}
                  />
                </span>
              )}
              {activeFilters.name && (
                <span className={styles.filterChip}>
                  Name: {activeFilters.name}
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Dismiss24Regular />}
                    onClick={() => handleRemoveFilter('name')}
                  />
                </span>
              )}
              {activeFilters.phoneNumber && (
                <span className={styles.filterChip}>
                  Phone: {activeFilters.phoneNumber}
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Dismiss24Regular />}
                    onClick={() => handleRemoveFilter('phoneNumber')}
                  />
                </span>
              )}
              {activeFilters.city && (
                <span className={styles.filterChip}>
                  City: {activeFilters.city}
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Dismiss24Regular />}
                    onClick={() => handleRemoveFilter('city')}
                  />
                </span>
              )}
              {activeFilters.state && (
                <span className={styles.filterChip}>
                  State: {activeFilters.state}
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Dismiss24Regular />}
                    onClick={() => handleRemoveFilter('state')}
                  />
                </span>
              )}
              {activeFilters.twitterHandle && (
                <span className={styles.filterChip}>
                  Twitter: {activeFilters.twitterHandle}
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Dismiss24Regular />}
                    onClick={() => handleRemoveFilter('twitterHandle')}
                  />
                </span>
              )}
              {activeFilters.igHandle && (
                <span className={styles.filterChip}>
                  Instagram: {activeFilters.igHandle}
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Dismiss24Regular />}
                    onClick={() => handleRemoveFilter('igHandle')}
                  />
                </span>
              )}
              {activeFilters.tiktokHandle && (
                <span className={styles.filterChip}>
                  TikTok: {activeFilters.tiktokHandle}
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Dismiss24Regular />}
                    onClick={() => handleRemoveFilter('tiktokHandle')}
                  />
                </span>
              )}
              <Button appearance="subtle" size="small" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}
        </form>
      </Card>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner size="large" />
          <Text>Searching...</Text>
        </div>
      ) : hasSearched ? (
        results && results.persons.length > 0 ? (
          <>
            <div className={styles.resultsHeader}>
              <Text className={styles.resultsCount}>
                Found {results.total} {results.total === 1 ? 'person' : 'people'}
              </Text>
            </div>
            <div className={styles.resultsContainer}>
              {results.persons.map((person) => (
                <Link
                  key={person.id}
                  to={`/persons/${person.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card className={styles.personCard}>
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
                          {formatLocation(person.city, person.state) && (
                            <span className={styles.metaItem}>
                              <Location24Regular />
                              {formatLocation(person.city, person.state)}
                            </span>
                          )}
                          {person.phoneNumber && (
                            <span className={styles.metaItem}>
                              <Phone24Regular />
                              {person.phoneNumber}
                            </span>
                          )}
                        </div>
                        <div className={styles.personStats}>
                          <Badge appearance="tint" color="brand">
                            {person._count?.posts || 0} {(person._count?.posts || 0) === 1 ? 'review' : 'reviews'}
                          </Badge>
                          {person.approximateAge && (
                            <Badge appearance="outline">~{person.approximateAge} years old</Badge>
                          )}
                          {person.gender && person.gender !== 'PREFER_NOT_TO_SAY' && (
                            <Badge appearance="outline">{person.gender}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🔍</span>
            <Text className={styles.emptyTitle}>No people found</Text>
            <Text className={styles.emptyText}>
              Try adjusting your search terms or filters. You can search by name,
              phone number, city, state, or social media handles.
            </Text>
          </div>
        )
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>👥</span>
          <Text className={styles.emptyTitle}>Start your search</Text>
          <Text className={styles.emptyText}>
            Enter a name or use the advanced filters to find people.
            Phone numbers are partially masked for privacy.
          </Text>
        </div>
      )}
    </div>
  );
};
