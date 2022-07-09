import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import fetcher from '../fetcher';
import { useStore } from '../store';

const useVideoByIdQuery = (videoId?: string) => {
  const router = useRouter();
  const accountKey = useStore((state) => state.account?.key);

  const id = videoId || (router.query.videoId as string);

  const { key, query } = fetcher.getVideoById(id, accountKey ?? undefined);

  return useQuery(key, query, {
    enabled: !!id,
  });
};

export default useVideoByIdQuery;
