import { Button } from "antd";
import type { Straight } from "../../types/games";
import { formatMarketName } from "../../lib/markets";
import { useParlayCart } from "../../context/ParlayCartContext";

interface Props {
  straight: Straight;
  gameId: number;
}

export default function ParlayCartButton({ straight, gameId }: Props) {
  const { addLeg, removeLeg, hasLeg } = useParlayCart();
  const inCart = hasLeg(straight.id);

  const display = `${straight.player_name ?? "?"} — ${formatMarketName(straight.market)} ${straight.comparator} ${straight.line}`;

  if (inCart) {
    return (
      <Button size="small" danger onClick={() => removeLeg(straight.id)}>
        Remove
      </Button>
    );
  }

  return (
    <Button
      size="small"
      onClick={() =>
        addLeg({ straight_id: straight.id, game_id: gameId, display, odds: straight.odds ?? null })
      }
    >
      + Parlay
    </Button>
  );
}
