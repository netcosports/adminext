import React from 'react';
import { Grid, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/router';
import { VideoPlus } from 'tabler-icons-react';

import FormDrawer from '../../components/FormDrawer';
import { useGetVideosQuery, VideosList } from '.';

function VideoPageLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useGetVideosQuery();
  const router = useRouter();

  const isRoot = router.pathname === '/videos';

  return (
    <>
      <Grid
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <LoadingOverlay visible={isLoading} />
        <Grid.Col span={isRoot ? 12 : 3}>
          <FormDrawer icon={<VideoPlus />} />
          <VideosList />
        </Grid.Col>
        <Grid.Col span={9}>{children}</Grid.Col>
      </Grid>
    </>
  );
}

export default VideoPageLayout;
