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
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useSearch, useCategories } from '../../hooks/useSearch';
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
});

export const SearchPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [hasSearched, setHasSearched] = useState(false);

  const { data: results, isLoading } = useSearch(filters);
  const { data: categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, query: searchQuery });
    setHasSearched(true);
  };

  const handleCategoryFilter = (category: string) => {
    setFilters({ ...filters, category });
    setHasSearched(true);
  };

  return (
    <div className={styles.container}>
      <Text className={styles.title}>Search</Text>

      <form onSubmit={handleSearch} className={styles.searchSection}>
        <Input
          className={styles.searchInput}
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          contentBefore={<Search24Regular />}
        />
        <Button appearance="primary" type="submit">
          Search
        </Button>
      </form>

      {categories && categories.length > 0 && (
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
      ) : hasSearched && results ? (
        results.posts.length > 0 ? (
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
                  <Badge appearance="outline">{post.category}</Badge>
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
                  <span>👍 {post.upvotes}</span>
                  <span>💬 {post.commentCount}</span>
                  <span>👁 {post.viewCount}</span>
                  <span>By {post.author?.username || 'Unknown'}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Text>No results found. Try different search terms.</Text>
          </div>
        )
      ) : (
        <div className={styles.emptyState}>
          <Text>Enter a search query to find posts</Text>
        </div>
      )}
    </div>
  );
};
