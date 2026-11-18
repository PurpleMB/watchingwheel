import "./SeasonDropdown.css";

interface SeasonDropdownProps {
  seasons: number[];
  selectedSeason: number | null;
  onSelectSeason: (season: number | null) => void;
  disabled?: boolean;
}

function SeasonDropdown({
  seasons,
  selectedSeason,
  onSelectSeason,
  disabled = false,
}: SeasonDropdownProps) {
  return (
    <div className="season-dropdown">
      <label htmlFor="season-select">Season:</label>
      <select
        id="season-select"
        value={selectedSeason ?? "null"}
        disabled={disabled || seasons.length === 0}
        onChange={(e) => onSelectSeason(e.target.value === "null" ? null : Number(e.target.value))}
      >
        {seasons.map((season) => (
          <option key={season} value={season}>
            {season === 0 ? "Specials" : `Season ${season}`}
          </option>
        ))}
        <option key={"any"} value="null">
          Any Season
        </option>
      </select>
    </div>
  );
}

export default SeasonDropdown;
