import React, { useMemo, useState } from 'react';
import { Avatar, ScrollArea, Stack, Table, TextInput } from '@mantine/core';
import Fuse from 'fuse.js';
import { useRouter } from 'next/router';
import { Video } from 'tabler-icons-react';

import { convertSecToHHMMSS } from '../../app/secToHHMMSS';
import StatusBadge from '../../components/StatusBadge';
import TdClipboardId from '../../components/TdClipboardId';
import { useSelected } from '../../hooks/useSelectedStyle';
import { useStickyHeader } from '../../hooks/useStickyHeader';
import { useGetVideosQuery } from '.';
import { Video as TVideo } from './fetcher';

function VideosList({ videos }: { videos?: TVideo[] }) {
  const [search, setSearch] = useState('');

  const router = useRouter();
  const { data } = useGetVideosQuery(!videos);

  const { classes, cx, setScrolled, scrolled } = useStickyHeader();

  const isRoot = router.pathname === '/videos';

  const fuse = useMemo(
    () =>
      new Fuse(videos || data || [], {
        keys: ['name', 'id'],
        minMatchCharLength: 2,
      }),
    [data],
  );

  const fuzzyResults = useMemo(
    () =>
      fuse?.search(search).map(({ item }) => {
        return <Item key={item.id} item={item} isRoot={isRoot} />;
      }),
    [fuse, search],
  );

  const results = (videos || data)?.map((item) => (
    <Item key={item.id} item={item} isRoot={isRoot} />
  ));

  return (
    <Stack>
      <div>
        <TextInput
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter videos"
          icon={<Video />}
        />
      </div>
      <ScrollArea sx={{ height: '80vh' }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table striped highlightOnHover>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>Thumbnail</th>
              <th>Title</th>
              {isRoot && (
                <>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Categories</th>
                  <th>Subcategories</th>
                  <th>Products</th>
                  <th>Status</th>
                </>
              )}
              <th>Copy ID</th>
            </tr>
          </thead>
          <tbody>{search ? fuzzyResults : results}</tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
}

export default VideosList;

function Item({ item, isRoot }: { item: TVideo; isRoot?: boolean }) {
  const { classes, isSelected } = useSelected('videoId');
  const router = useRouter();

  return (
    <tr
      style={{
        cursor: item.status === 'in_progress' ? 'not-allowed' : 'pointer',
      }}
      key={item.id}
      onClick={() =>
        item.status !== 'in_progress' &&
        router.push(`/videos/${item.id}?tabs=${router.query.tabs || 'general'}`)
      }
      className={isSelected(item.id) ? classes.root : undefined}
    >
      <td>
        <Avatar src={`${item.poster}?auto=format&h=120&w=120`}>
          <Video />
        </Avatar>
      </td>
      <td>{item.name}</td>
      {isRoot && (
        <>
          <td>{item.description?.substring(0.2)}...</td>
          <td>{convertSecToHHMMSS(item.duration)}</td>
          <td>{item.Categories.length}</td>
          <td>{item.VideoCategorySubCategories.length}</td>
          <td>{item.ItemProducts.length}</td>
          <td>
            <StatusBadge status={item.status} />
          </td>
        </>
      )}
      <TdClipboardId id={item.id} />
    </tr>
  );
}
