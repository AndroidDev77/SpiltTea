import React, { useState } from 'react';
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
  Tab,
  TabList,
} from '@fluentui/react-components';
import {
  Search24Regular,
  Person24Regular,
  CheckmarkCircle24Filled,
  Location24Regular,
} from '@fluentui/react-icons';
import { useNavigate, Link } from 'react-router-dom';
import { useSearch, useCategories } from '../../hooks/useSearch';
import { useSearchPersons } from '../../hooks/usePersons';
import type { SearchFilters } from '../../types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  searchSection: {
    display: 'flex',
    ...shorthands.gap('12px'),
  },
  searchInput: {
    flex: 1,
  },
  tabsContainer: {
    marginBottom: '8px',
  },
  filters: {
    display: 'flex',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  resultCard: {
    ...shorthands.padding('20px'),
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  resultTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
  },
  resultContent: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  resultMeta: {
    display: 'flex',
    ...shorthands.gap('16px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  resultTags: {
    display: 'flex',
    ...shorthands.gap('8px'),
    marginTop: '8px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('48px'),
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('48px'),
    color: tokens.colorNeutralForeground2,
  },
  personCard: {
    ...shorthands.padding('16px'),
    cursor: 'pointer',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  personInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
  },
  avatar: {
    width: '56px',
    height: '56px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: tokens.colorNeutralBackground5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: tokens.fontSizeBase500,
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
    ...shorthands.gap('8px'),
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  verifiedIcon: {
    color: tokens.colorPaletteGreenForeground1,
  },
  personLocation: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '4px',
  },
  personStats: {
    display: 'flex',
    ...shorthands.gap('12px'),
    alignItems: 'center',
  },
  personAbout: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    marginTop: '4px',
  },
});

type TabType = 'posts' | 'people';

export const SearchPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [hasSearched, setHasSearched] = useState(false);

  const { data: results, isLoading: postsLoading } = useSearch(filters);
  const { data: personResults, isLoading: personsLoading } = useSearchPersons(activeQuery);
  const { data: categories } = useCategories();

  const isLoading = activeTab === 'posts' ? postsLoading : personsLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, query: searchQuery });
    setActiveQuery(searchQuery);
    setHasSearched(true);
  };

  const handleCategoryFilter = (category: string) => {
    setFilters({ ...filters, category });
    setHasSearched(true);
  };

  const handleTabChange = (_: unknown, data: { value: TabType }) => {
    setActiveTab(data.value);
  };

  const formatLocation = (city?: string, state?: string) => {
    const parts = [city, state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  return (
    <div className={styles.container}>
      <Text className={styles.title}>Search</Text>

      <form onSubmit={handleSearch} className={styles.searchSection}>
        <Input
          className={styles.searchInput}
          placeholder={activeTab === 'posts' ? 'Search posts...' : 'Search people...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          contentBefore={<Search24Regular />}
        />
        <Button appearance="primary" type="submit">
          Search
        </Button>
      </form>

      <div className={styles.tabsContainer}>
        <TabList selectedValue={activeTab} onTabSelect={handleTabChange as any}>
          <Tab value="posts">Posts</Tab>
          <Tab value="people">People</Tab>
        </TabList>
      </div>

      {activeTab === 'posts' && categories && categories.length > 0 && (
        <div className={styles.filters}>
          <Text>Categories:</Text>
          <Button
            appearance={!filters.category ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleCategoryFilter('')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              appearance={filters.category === category ? 'primary' : 'secondary'}
              size="small"
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner label="Searching..." />
        </div>
      ) : hasSearched ? (
        activeTab === 'posts' ? (
          // Posts results
          results && results.posts.length > 0 ? (
            <div className={styles.resultsContainer}>
              <Text>Found {results.total} results</Text>
              {results.posts.map((post) => (
                <Card
                  key={post.id}
                  className={styles.resultCard}
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <div>
                    <Text className={styles.resultTitle}>{post.title}</Text>
                    {post.person && (
                      <Badge appearance="filled" color="brand">
                        About: {post.person.name}
                      </Badge>
                    )}
                    {post.category && (
                      <Badge appearance="outline" style={{ marginLeft: '8px' }}>
                        {post.category}
                      </Badge>
                    )}
                  </div>

                  <Text className={styles.resultContent}>{post.content}</Text>

                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.resultTags}>
                      {post.tags.map((tag) => (
                        <Badge key={tag} size="small" appearance="tint">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className={styles.resultMeta}>
                    <span>{post._count?.likes || post.upvotes || 0} likes</span>
                    <span>{post._count?.comments || post.commentCount || 0} comments</span>
                    <span>{post.viewCount} views</span>
                    <span>By {post.author?.username || 'Unknown'}</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Text>No posts found. Try different search terms.</Text>
            </div>
          )
        ) : (
          // People results
          personResults && personResults.persons.length > 0 ? (
            <div className={styles.resultsContainer}>
              <Text>Found {personResults.total} people</Text>
              {personResults.persons.map((person) => (
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
                        {formatLocation(person.city, person.state) && (
                          <div className={styles.personLocation}>
                            <Location24Regular />
                            <span>{formatLocation(person.city, person.state)}</span>
                          </div>
                        )}
                        <div className={styles.personStats}>
                          <Badge appearance="tint">
                            {person._count?.posts || 0} {(person._count?.posts || 0) === 1 ? 'review' : 'reviews'}
                          </Badge>
                          {person.approximateAge && (
                            <Badge appearance="outline">~{person.approximateAge} years old</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Text>No people found. Try different search terms.</Text>
            </div>
          )
        )
      ) : (
        <div className={styles.emptyState}>
          <Text>
            {activeTab === 'posts'
              ? 'Enter a search query to find posts'
              : 'Enter a name to find people'}
          </Text>
        </div>
      )}
    </div>
  );
};
