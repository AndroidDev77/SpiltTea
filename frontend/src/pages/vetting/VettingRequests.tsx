import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Button,
  Spinner,
  Badge,
  TabList,
  Tab,
} from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';
import { useVettingRequests } from '../../hooks/useVetting';
import { Add24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  tabs: {
    marginBottom: '16px',
  },
  requestsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  requestCard: {
    ...shorthands.padding('20px'),
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  requestDescription: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    marginBottom: '12px',
  },
  requestMeta: {
    display: 'flex',
    ...shorthands.gap('16px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  reward: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
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

export const VettingRequests: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const { data, isLoading } = useVettingRequests({ status: statusFilter });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { appearance: any; text: string }> = {
      pending: { appearance: 'filled', text: 'Pending' },
      accepted: { appearance: 'tint', text: 'In Progress' },
      completed: { appearance: 'filled', text: 'Completed' },
      cancelled: { appearance: 'outline', text: 'Cancelled' },
    };
    return statusMap[status] || statusMap.pending;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner label="Loading vetting requests..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Vetting Requests</Text>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={() => navigate('/vetting/create')}
        >
          Create Request
        </Button>
      </div>

      <TabList
        selectedValue={statusFilter}
        onTabSelect={(_, data) => setStatusFilter(data.value as string)}
        className={styles.tabs}
      >
        <Tab value="pending">Pending</Tab>
        <Tab value="accepted">In Progress</Tab>
        <Tab value="completed">Completed</Tab>
        <Tab value="cancelled">Cancelled</Tab>
      </TabList>

      {data && data.data.length > 0 ? (
        <div className={styles.requestsContainer}>
          {data.data.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            return (
              <Card
                key={request.id}
                className={styles.requestCard}
                onClick={() => navigate(`/vetting/${request.id}`)}
              >
                <div className={styles.requestHeader}>
                  <div>
                    <Badge appearance={statusBadge.appearance}>
                      {statusBadge.text}
                    </Badge>
                  </div>
                  <Text className={styles.reward}>💰 {request.reward} trust</Text>
                </div>

                <Text className={styles.requestDescription}>
                  {request.description}
                </Text>

                <div className={styles.requestMeta}>
                  <span>Post: {request.post?.title || 'Unknown'}</span>
                  <span>•</span>
                  <span>By {request.requester?.username || 'Unknown'}</span>
                  <span>•</span>
                  <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Text>No {statusFilter} vetting requests found.</Text>
        </div>
      )}
    </div>
  );
};
