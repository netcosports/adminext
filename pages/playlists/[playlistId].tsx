import { LoadingOverlay, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';

import {
  Display,
  Edito,
  PlaylistPageLayout,
  useGetPlaylistByIdQuery,
} from '../../src/features/playlists';
import { VideosList } from '../../src/features/videos';
import { Video } from '../../src/features/videos/fetcher';
import useEscapeKey from '../../src/hooks/useEscapeKey';

const tabsMap: {
  [key: string]: string;
} = {
  general: 'general',
  videos: 'videos',
};
function PlaylistId() {
  const router = useRouter();
  const { data, isLoading, isRefetching } = useGetPlaylistByIdQuery();

  useEscapeKey('/playlists');

  return (
    <PlaylistPageLayout>
      {data && (
        <Tabs
          value={tabsMap[router.query.tabs as string]}
          onTabChange={(i) =>
            router.push({
              pathname: router.asPath.split('?')[0],
              query: { tabs: Object.keys(tabsMap).find((k) => tabsMap[k] === i) },
            })
          }
        >
          <Tabs.List>
            {Object.values(tabsMap).map((tab) => (
              <Tabs.Tab value={tab} key={tab}>
                {tab.toUpperCase()}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <div
            style={{
              width: '100%',
              minHeight: '80vh',
              height: '100%',
              position: 'relative',
            }}
          >
            <LoadingOverlay visible={isLoading || isRefetching} />
            <Tabs.Panel value="general">
              <Edito {...data} />
              <Display {...data} />
            </Tabs.Panel>
            <Tabs.Panel value="videos">
              <VideosList videos={data.Videos as Video[]} />
            </Tabs.Panel>
          </div>
        </Tabs>
      )}
    </PlaylistPageLayout>
  );
}

export default PlaylistId;
