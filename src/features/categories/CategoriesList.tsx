import React, { useMemo, useState } from 'react';
import { Avatar, Stack, Table, TextInput } from '@mantine/core';
import Fuse from 'fuse.js';
import { useRouter } from 'next/router';
import { Category } from 'tabler-icons-react';

import { useSelected } from '../../hooks/useSelectedStyle';
import { useGetCategoriesQuery } from '.';

function CategoriesList() {
  const router = useRouter();
  const { classes, isSelected } = useSelected('categoryId');
  const { data = [] } = useGetCategoriesQuery();

  const [search, setSearch] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(data || [], {
        keys: ['name'],
        minMatchCharLength: 2,
      }),
    [data],
  );

  const fuzzyResults = fuse.search(search).map(({ item }) => {
    return (
      <tr
        style={{
          cursor: 'pointer',
        }}
        key={item.id}
        onClick={() => router.push(`/categories/${item.id}?tabs=display`)}
        className={isSelected(item.id) ? classes.root : undefined}
      >
        <td>
          <Avatar src={`${item.thumbnail}?auto=format&h=120&w=120`} />
        </td>
        <td>{item.name}</td>
      </tr>
    );
  });

  const results = data?.map((item) => (
    <tr
      style={{
        cursor: 'pointer',
      }}
      key={item.id}
      onClick={() => router.push(`/categories/${item.id}?tabs=display`)}
      className={isSelected(item.id) ? classes.root : undefined}
    >
      <td>
        <Avatar src={`${item.thumbnail}?auto=format&h=120&w=120`} />
      </td>
      <td>{item.name}</td>
    </tr>
  ));

  return (
    <Stack>
      <div>
        <TextInput
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter Categories"
          icon={<Category />}
        />
      </div>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>{search ? fuzzyResults : results}</tbody>
      </Table>
    </Stack>
  );
}

export default CategoriesList;
