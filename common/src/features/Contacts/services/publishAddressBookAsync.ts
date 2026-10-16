import { ReducerCreators } from '@reduxjs/toolkit'
import { RejectedError, toRejectedError } from '@common/utils/errorUtils'
import { setAddressBookPublished } from '../ContactsDao'
import { ContactsState } from '../contactsTypes'

export interface PublishAddressBookPayload {
  userId: string
  addressBookId: string
  publish: boolean
}

export const publishAddressBookThunk = (
  create: ReducerCreators<ContactsState>
) =>
  create.asyncThunk<
    void,
    PublishAddressBookPayload,
    { rejectValue: RejectedError }
  >(
    async ({ userId, addressBookId, publish }, { rejectWithValue }) => {
      try {
        await setAddressBookPublished(userId, addressBookId, publish)
      } catch (err) {
        return rejectWithValue(toRejectedError(err))
      }
    },
    {
      pending: state => {
        state.error = null
      },
      fulfilled: () => {},
      rejected: (state, action) => {
        if (action.payload?.status !== 401) {
          state.error = 'contacts.errors.share'
        }
      }
    }
  )
