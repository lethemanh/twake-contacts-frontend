import { render, screen } from '@testing-library/react'
import { TwakeMuiThemeProvider } from '@linagora/twake-mui'
import { Phone } from '@linagora/twake-icons'
import I18n from 'twake-i18n'
import en from '@common/locales/en.json'
import { EntryList } from './EntryList'

const mockUseBreakpoints = jest.fn(() => ({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isExtraLarge: false
}))

jest.mock('@linagora/twake-mui', () => {
  const actual = jest.requireActual('@linagora/twake-mui')
  return {
    ...actual,
    useBreakpoints: () => mockUseBreakpoints()
  }
})

function renderWithProviders(
  ui: React.ReactElement
): ReturnType<typeof render> {
  return render(
    <TwakeMuiThemeProvider>
      <I18n dictRequire={() => en} lang="en">
        {ui}
      </I18n>
    </TwakeMuiThemeProvider>
  )
}

describe('EntryList', () => {
  beforeEach(() => {
    mockUseBreakpoints.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isExtraLarge: false
    })
  })

  it('renders desktop grid sizes with type selector', () => {
    const { container } = renderWithProviders(
      <EntryList
        icon={Phone}
        entries={[{ type: 'home', value: '123' }]}
        types={['home', 'work']}
        label="Phone"
        onChange={jest.fn()}
        onRemove={jest.fn()}
        showTypeSelector={true}
      />
    )

    const gridItems = container.querySelectorAll('.MuiGrid-root')
    expect(gridItems[1]).toHaveClass('MuiGrid-grid-xs-5')
    expect(gridItems[2]).toHaveClass('MuiGrid-grid-xs-3')
    expect(gridItems[3]).toHaveClass('MuiGrid-grid-xs-1')
  })

  it('renders mobile full grid for a single entry with type selector', () => {
    mockUseBreakpoints.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isExtraLarge: false
    })

    const { container } = renderWithProviders(
      <EntryList
        icon={Phone}
        entries={[{ type: 'home', value: '123' }]}
        types={['home', 'work']}
        label="Phone"
        onChange={jest.fn()}
        onRemove={jest.fn()}
        showTypeSelector={true}
      />
    )

    const gridItems = container.querySelectorAll('.MuiGrid-root')
    expect(gridItems[1]).toHaveClass('MuiGrid-grid-xs-8')
    expect(gridItems[2]).toHaveClass('MuiGrid-grid-xs-4')
    expect(gridItems).toHaveLength(3)
  })

  it('renders mobile full grid for a single entry without type selector', () => {
    mockUseBreakpoints.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isExtraLarge: false
    })

    const { container } = renderWithProviders(
      <EntryList
        icon={Phone}
        entries={[{ type: '', value: 'alice@example.com' }]}
        types={[]}
        label="Email"
        onChange={jest.fn()}
        onRemove={jest.fn()}
        showTypeSelector={false}
      />
    )

    const gridItems = container.querySelectorAll('.MuiGrid-root')
    expect(gridItems[1]).toHaveClass('MuiGrid-grid-xs-12')
    expect(gridItems).toHaveLength(2)
  })

  it('renders mobile full grid for multiple entries with type selector', () => {
    mockUseBreakpoints.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isExtraLarge: false
    })

    const { container } = renderWithProviders(
      <EntryList
        icon={Phone}
        entries={[
          { type: 'home', value: '123' },
          { type: 'work', value: '456' }
        ]}
        types={['home', 'work']}
        label="Phone"
        onChange={jest.fn()}
        onRemove={jest.fn()}
        showTypeSelector={true}
      />
    )

    const rows = container.querySelectorAll('.MuiGrid-container')
    expect(rows).toHaveLength(2)

    const row1Items = rows[0].querySelectorAll(':scope > .MuiGrid-root')
    expect(row1Items[0]).toHaveClass('MuiGrid-grid-xs-6')
    expect(row1Items[1]).toHaveClass('MuiGrid-grid-xs-4')
    expect(row1Items[2]).toHaveClass('MuiGrid-grid-xs-2')

    const row2Items = rows[1].querySelectorAll(':scope > .MuiGrid-root')
    expect(row2Items[0]).toHaveClass('MuiGrid-grid-xs-6')
    expect(row2Items[1]).toHaveClass('MuiGrid-grid-xs-4')
    expect(row2Items[2]).toHaveClass('MuiGrid-grid-xs-2')
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })

  it('renders mobile full grid for multiple entries without type selector', () => {
    mockUseBreakpoints.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isExtraLarge: false
    })

    const { container } = renderWithProviders(
      <EntryList
        icon={Phone}
        entries={[
          { type: '', value: 'alice@example.com' },
          { type: '', value: 'bob@example.com' }
        ]}
        types={[]}
        label="Email"
        onChange={jest.fn()}
        onRemove={jest.fn()}
        showTypeSelector={false}
      />
    )

    const rows = container.querySelectorAll('.MuiGrid-container')
    expect(rows).toHaveLength(2)

    const row1Items = rows[0].querySelectorAll(':scope > .MuiGrid-root')
    expect(row1Items[0]).toHaveClass('MuiGrid-grid-xs-10')
    expect(row1Items[1]).toHaveClass('MuiGrid-grid-xs-2')

    const row2Items = rows[1].querySelectorAll(':scope > .MuiGrid-root')
    expect(row2Items[0]).toHaveClass('MuiGrid-grid-xs-10')
    expect(row2Items[1]).toHaveClass('MuiGrid-grid-xs-2')
  })
})
