import React, { useState } from 'react'
import { Stack, Typography, Switch } from '@linagora/twake-mui'
import { Icon, Magnifier } from '@linagora/twake-icons'
import { useI18n } from 'twake-i18n'
import { useAppDispatch, useAppSelector } from '@common/app/hooks'
import {
  publishAddressBook,
  fetchAddressBookDetail
} from '@common/features/Contacts/ContactsSlice'

interface DiscoverySectionProps {
  userId: string | undefined
  addressBookId: string | undefined
}

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  userId,
  addressBookId
}) => {
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const isPublic = useAppSelector(state =>
    Boolean(
      addressBookId && state.contacts.addressBooks[addressBookId]?.isPublic
    )
  )
  const [loading, setLoading] = useState(false)

  const handleToggle = async (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): Promise<void> => {
    if (!userId || !addressBookId) return
    setLoading(true)
    try {
      await dispatch(
        publishAddressBook({ userId, addressBookId, publish: checked })
      ).unwrap()
      void dispatch(
        fetchAddressBookDetail({ userId, addressBookId, silent: true })
      )
    } catch {
      // keep previous state on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack spacing={1} className="u-mt-2">
      <Typography variant="body2">
        {t('contacts.share.discovery.title')}
      </Typography>
      <Stack
        direction="row"
        className="u-flex-items-center u-flex-justify-between"
      >
        <Stack direction="row" className="u-flex-items-center" spacing={1}>
          <Icon icon={Magnifier} />
          <Typography variant="body2" color="textSecondary">
            {t('contacts.share.discovery.description')}
          </Typography>
        </Stack>
        <Switch
          checked={isPublic}
          onChange={handleToggle}
          disabled={loading || !userId || !addressBookId}
          slotProps={{
            input: { 'aria-label': t('contacts.share.discovery.toggleTooltip') }
          }}
        />
      </Stack>
    </Stack>
  )
}
