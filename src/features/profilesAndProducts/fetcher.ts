import { betterFetch } from '../../app/betterFetch';
import { PAYMENT_SERVICE_URL, USERS_SERVICE_URL } from '../../app/constants';
import { FanWithProfiles } from '../fans/fetcher';
import { Products } from './Products';

export const getProfiles = (accountKey: string | undefined) => ({
  key: ['profiles', { accountKey }],
  query: async () =>
    betterFetch(`${USERS_SERVICE_URL}/profiles`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-account-key': accountKey || '',
      },
    }).then((response) => response.json() as Promise<Profile[]>),
});

export const getProducts = (accountKey: string | undefined) => ({
  key: ['products', { accountKey }],
  query: async () =>
    betterFetch(`${PAYMENT_SERVICE_URL}/back-office/products`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-account-key': accountKey || '',
      },
    }).then((res) => res.json() as Promise<Products>),
});

export const mutateFanProfiles = (
  accountKey: string | undefined,
  accountId: string | undefined,
) => ({
  mutation: async (values: { fanId: string; profiles: string[] }) =>
    betterFetch(`${USERS_SERVICE_URL}/fans/${values.fanId}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-account-key': accountKey || '',
      },
      body: JSON.stringify({ accountId, Profiles: values.profiles }),
    }).then((res) => res.json() as Promise<FanWithProfiles>),
});

export const mutateProduct = (accountKey: string | undefined, accountId: string | undefined) => ({
  mutation: async (values: {
    name: string;
    description?: string;
    paymentOffers?: string[];
    profileIds?: string[];
  }) =>
    betterFetch(`${PAYMENT_SERVICE_URL}/back-office/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-account-key': accountKey || '',
      },
      body: JSON.stringify({
        accountId: accountId,
        name: values.name,
        data: {
          description: values.description,
        },
        paymentOffers: values.paymentOffers,
        profileIds: values.profileIds,
      }),
    }).then((res) => res.json() as Promise<Products['items'][number]>),
});

export interface Profile {
  id: string;
  name: string;
  description: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  AccountId: string;
}
