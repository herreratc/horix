import { Crown, Clock } from "lucide-react";
import { Badge } from "./ui/badge";

interface PremiumBadgeProps {
  plano: string;
  isInTrial?: boolean;
  trialDaysLeft?: number;
}

export const PremiumBadge = ({ plano, isInTrial, trialDaysLeft }: PremiumBadgeProps) => {
  if (plano === 'premium') {
    return (
      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
        <Crown className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    );
  }

  if (isInTrial && trialDaysLeft) {
    return (
      <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
        <Clock className="w-3 h-3 mr-1" />
        Trial - {trialDaysLeft} dias restantes
      </Badge>
    );
  }

  return (
    <Badge variant="outline">
      Grátis
    </Badge>
  );
};
