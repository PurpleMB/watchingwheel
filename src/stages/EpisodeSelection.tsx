import { useState, useEffect } from "react";
import type { Show, Episode } from "../api/tvMaze.types";
import { getShowEpisodeList } from "../api/tvMaze";
import Wheel from "../components/Wheel";
import SeasonDropdown from "../components/SeasonDropdown";
import { WHEEL_STANDARD } from "../constants/palettes";
import { Button } from "react-bootstrap";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface EpisodeSelectionProps {
  show: Show;
  onSelectEpisode: (episode: Episode) => void;
  onBack: () => void;
}

function EpisodeSelection({
  show,
  onSelectEpisode,
  onBack,
}: EpisodeSelectionProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  const seasons = [...new Set(episodes.map((ep) => ep.season))].sort(
    (a, b) => a - b,
  );
  const seasonEpisodes = episodes.filter((ep) => ep.season === selectedSeason || selectedSeason === null);
  const shuffledSeasonEpisodes = shuffleArray<Episode>(seasonEpisodes);
  const wheelItems = shuffledSeasonEpisodes.map((ep) => ep.name);

  useEffect(() => {
    let active = true;

    setEpisodes([]);
    setSelectedSeason(null);
    setIsLoading(true);

    getShowEpisodeList(show.id)
      .then((response) => {
        if (!active) return;

        const episodes = response.map((ep) => ({ ...ep, show }));
        const seasons = [...new Set(episodes.map((ep) => ep.season))].sort(
          (a, b) => a - b,
        );

        setEpisodes(episodes);
        setSelectedSeason(seasons[0] ?? null);
      })
      .catch((error: unknown) => {
        console.error(error);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [show]);

  return (
    <>
      <h2>{show.name}</h2>

      <SeasonDropdown
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSelectSeason={setSelectedSeason}
        disabled={isLoading || isSpinning}
      />

      <Button 
        type="button" 
        onClick={() => setEpisodes(shuffleArray(episodes))}
        disabled={isLoading || isSpinning}
      >
        <i className="bi bi-shuffle"></i> Shuffle Episodes
      </Button>

      {isLoading && <p>Loading episodes...</p>}

      {!isLoading &&
        seasonEpisodes.length === 0 && (
          <p>No episodes available for this season.</p>
        )}

      {!isLoading &&
        seasonEpisodes.length > 0 && (
          <Wheel
            radius={250}
            items={wheelItems}
            colors={WHEEL_STANDARD}
            isSpinLocked={true}
            onSpinStateChange={setIsSpinning}
            onResult={(winningEpisodeName) =>
              onSelectEpisode(seasonEpisodes.find((ep) => ep.name === winningEpisodeName)!)
            }
          />
        )}

      <button onClick={onBack}>Back</button>
    </>
  );
}

export default EpisodeSelection;
