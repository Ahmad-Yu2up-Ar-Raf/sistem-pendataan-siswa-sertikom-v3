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
import states from '@/config/data/states.json'
// Import JSON data directly
import countries from '@/config/data/countries.json'
import { CountryProps, StateProps } from "@/components/ui/fragments/custom-ui/input/select/location-input";

interface ProvinceSelectorProps {
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  countryName?: string
  onProvinceSelect?: (province: StateProps | null) => void
}

export const ProvinceSelector = ({
  disabled = false,
  value,
  onChange,
  countryName,
  onProvinceSelect,
}: ProvinceSelectorProps) => {
  const [selectedProvince, setSelectedProvince] = useState<StateProps | null>(null)
  const [openDropdown, setOpenDropdown] = useState(false)

  const countriesData = countries as CountryProps[]
  const statesData = states as  StateProps[]


  // Find country by name
  const selectedCountry = countryName 
    ? countriesData.find(c => c.name === countryName)
    : null



  // DEBUG: Check first few states to see the structure
  if (statesData.length > 0) {
  
    
    // Try to find ANY state that matches
    const matchingStates = statesData.filter(state => {
    
      return state.country_id === selectedCountry?.id
    }).slice(0, 5) // Only log first 5 matches
    
    
  }

  // Filter provinces for selected country - FIXED: Handle type mismatch
  const availableProvinces = selectedCountry
    ? statesData.filter((state) => {
        // Handle both string and number comparison
        const stateCountryId = state.country_id 
        const selectedCountryId = selectedCountry.id
        
        // Compare as both string and number
        return stateCountryId == selectedCountryId || 
               Number(stateCountryId) === Number(selectedCountryId) ||
               String(stateCountryId) === String(selectedCountryId)
      })
    : []


  if (availableProvinces.length > 0) {

  }

  const hasProvinces = availableProvinces.length > 0

  // SIMPLIFIED DISABLED LOGIC - JUST CHECK IF WE HAVE PROVINCES
  const isButtonDisabled = disabled || !hasProvinces



  // Initialize from value prop
  useEffect(() => {
    if (value && availableProvinces.length > 0) {
      const province = availableProvinces.find(p => p.name === value)
      if (province && (!selectedProvince || selectedProvince.name !== value)) {
        setSelectedProvince(province)
      }
    }
  }, [value, availableProvinces.length])

  // Reset province when country changes
  useEffect(() => {
    if (selectedCountry && selectedProvince?.country_id !== selectedCountry.id) {
   
      setSelectedProvince(null)
      onChange?.('')
      onProvinceSelect?.(null)
    }
  }, [selectedCountry?.id])

  const handleSelect = (province: StateProps) => {
    
    setSelectedProvince(province)
    onChange?.(province.name)
    onProvinceSelect?.(province)
    setOpenDropdown(false)
  }

  return (
    <div className="w-full">
      <Popover 
        open={openDropdown} 
        onOpenChange={setOpenDropdown}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            type="button"
            aria-expanded={openDropdown}
            disabled={isButtonDisabled}
            className={cn(
              "w-full justify-between h-10",
              isButtonDisabled && "cursor-not-allowed opacity-50"
            )}
          >
            {selectedProvince ? (
              <span className="truncate text-sm">{selectedProvince.name}</span>
            ) : (
              <span className="text-muted-foreground text-sm">
                {!countryName 
                  ? "Select country first..." 
                  : !hasProvinces 
                  ? "No provinces available" 
                  : "Select Province..."}
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        {hasProvinces && (
          <PopoverContent 
            className="p-0 w-[--radix-popover-trigger-width] min-w-[300px]"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <Command>
              <CommandInput placeholder="Search province..." className="h-9" />
              <CommandList>
                <CommandEmpty>No province found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {availableProvinces.map((province) => (
                      <CommandItem
                        key={province.id}
                        value={province.name}
                        onSelect={() => handleSelect(province)}
                        className="flex cursor-pointer items-center justify-between text-sm py-2"
                      >
                        <span className="truncate flex-1 min-w-0">{province.name}</span>
                        <Check
                          className={cn(
                            'h-4 w-4 shrink-0 ml-2',
                            selectedProvince?.id === province.id
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
        )}
      </Popover>
      
     
    </div>
  )
}