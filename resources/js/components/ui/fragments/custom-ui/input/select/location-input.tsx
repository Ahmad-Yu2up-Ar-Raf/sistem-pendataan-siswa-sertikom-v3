import React, { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/fragments/shadcn-ui/scroll-area'
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/fragments/shadcn-ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/fragments/shadcn-ui/popover'
import { cn } from '@/lib/utils'

// Import JSON data directly
import countries from '@/config/data/countries.json'


interface Timezone {
  zoneName: string
  gmtOffset: number
  gmtOffsetName: string
  abbreviation: string
  tzName: string
}

export interface CountryProps {
  id: number
  name: string
  iso3: string
  iso2: string
  numeric_code: string
  phone_code: string
  capital: string
  currency: string
  currency_name: string
  currency_symbol: string
  tld: string
  native: string
  region: string
  region_id: string
  subregion: string
  subregion_id: string
  nationality: string
  timezones: Timezone[]
  translations: Record<string, string>
  latitude: string
  longitude: string
  emoji: string
  emojiU: string
}

export interface StateProps {
  id: number
  name: string
  country_id: number
  country_code: string
  country_name: string
  state_code: string
  type: string | null
  latitude: string
  longitude: string
}

// ==================== COUNTRY SELECTOR ====================
interface CountrySelectorProps {
  disabled?: boolean
  value?: string | undefined    // <-- allow undefined
  onChange?: (value: string) => void
  onCountrySelect?: (country: CountryProps | null) => void
}

export const CountrySelector = ({
  disabled,
  value = "ID",
  onChange,
  onCountrySelect,
}: CountrySelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(null)
  const [openDropdown, setOpenDropdown] = useState(false)

  const countriesData = countries as CountryProps[]

  // Initialize from value prop
 useEffect(() => {
    if (!value) {
      setSelectedCountry(null)
      onCountrySelect?.(null)
      return
    }

    // support: search by name, iso2 or iso3
    const country = countriesData.find(c =>
      c.name === value || c.iso2 === value || c.iso3 === value
    )

    if (country && selectedCountry?.id !== country.id) {
      setSelectedCountry(country)
      onCountrySelect?.(country)
    }
  }, [value])

  const handleSelect = (country: CountryProps) => {
 
    setSelectedCountry(country)
    onChange?.(country.name)
    onCountrySelect?.(country)
    setOpenDropdown(false)
  }

  return (
    <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          type="button"
          aria-expanded={openDropdown}
          disabled={disabled}
          className="w-full justify-between h-10"
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-base">{selectedCountry.emoji}</span>
              <span className="truncate text-sm">{selectedCountry.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Pilih Negara...</span>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-[--radix-popover-trigger-width] min-w-[300px]"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[300px]">
                {countriesData.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={country.name}
                    onSelect={() => handleSelect(country)}
                    className="flex cursor-pointer items-center justify-between text-sm py-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-base">{country.emoji}</span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4 shrink-0 ml-2',
                        selectedCountry?.id === country.id
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ==================== PROVINCE/STATE SELECTOR ====================
