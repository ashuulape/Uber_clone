import React from 'react'

const LocationSearchPanel = ({ suggestions = [], isLoading = false, onSelectSuggestion, setpanelopen }) => {
  const hasSuggestions = suggestions.length > 0

  return (
    <div className="bg-black h-fit w-full overflow-y-auto px-5 py-3 flex flex-col gap-1 select-none">
      {isLoading ? (
        <div className="px-2 py-4 text-sm text-zinc-400">Searching locations...</div>
      ) : !hasSuggestions ? (
        <div className="px-2 py-4 text-sm text-zinc-400">Type a pickup or destination to see live suggestions.</div>
      ) : (
        suggestions.map((loc) => (
          <div
            onClick={() => {
              onSelectSuggestion?.(loc)
            }}
            key={loc.id}
            className="flex items-start gap-4 active:bg-zinc-900 p-2 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center min-w-[50px]">
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white border border-zinc-800">
                <i className="ri-map-pin-line text-lg text-gray-300"></i>
              </div>
            </div>

            <div className="flex-1 flex flex-col h-full justify-center border-b border-zinc-900 pr-2 min-w-0">
              <h4 className="text-lg font-semibold text-zinc-100 leading-tight truncate">
                {loc.name}
              </h4>
              <p className="text-[13px] text-zinc-400 mt-1 font-thin truncate">
                {loc.address}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default LocationSearchPanel