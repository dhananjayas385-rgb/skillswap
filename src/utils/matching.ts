import { User, SkillOffer, SkillWant, MatchResult } from '../types';

export function calculateSmartMatch(
  currentUser: User | null,
  otherUser: User,
  allOffers: SkillOffer[],
  allWants: SkillWant[]
): MatchResult {
  if (!currentUser || currentUser.id === otherUser.id) {
    return { score: 0, label: 'Same User', isTwoWay: false };
  }

  const myOffers = allOffers.filter((o) => o.userId === currentUser.id);
  const myWants = allWants.filter((w) => w.userId === currentUser.id);
  const theirOffers = allOffers.filter((o) => o.userId === otherUser.id);
  const theirWants = allWants.filter((w) => w.userId === otherUser.id);

  // Check if they teach something I want
  let matchingSkillOffered: SkillOffer | undefined;
  let matchingSkillWanted: SkillWant | undefined;

  for (const tOffer of theirOffers) {
    for (const mWant of myWants) {
      if (
        tOffer.skillName.toLowerCase().includes(mWant.skillName.toLowerCase()) ||
        mWant.skillName.toLowerCase().includes(tOffer.skillName.toLowerCase()) ||
        tOffer.category === mWant.category
      ) {
        matchingSkillOffered = tOffer;
        matchingSkillWanted = mWant;
        break;
      }
    }
    if (matchingSkillOffered) break;
  }

  // Check if I teach something they want
  let twoWayMatch = false;
  for (const mOffer of myOffers) {
    for (const tWant of theirWants) {
      if (
        mOffer.skillName.toLowerCase().includes(tWant.skillName.toLowerCase()) ||
        tWant.skillName.toLowerCase().includes(mOffer.skillName.toLowerCase()) ||
        mOffer.category === tWant.category
      ) {
        twoWayMatch = true;
        break;
      }
    }
    if (twoWayMatch) break;
  }

  if (matchingSkillOffered && twoWayMatch) {
    return {
      score: 98,
      label: '⚡ Great Match!',
      isTwoWay: true,
      matchingSkillOffered,
      matchingSkillWanted,
    };
  }

  if (matchingSkillOffered) {
    return {
      score: 85,
      label: '🎯 Skill Match',
      isTwoWay: false,
      matchingSkillOffered,
      matchingSkillWanted,
    };
  }

  if (twoWayMatch) {
    return {
      score: 75,
      label: '💡 Teachable Match',
      isTwoWay: false,
    };
  }

  // Fallback category overlap match
  const categoryOverlap = myWants.some((mw) =>
    theirOffers.some((to) => to.category === mw.category)
  );

  if (categoryOverlap) {
    return {
      score: 65,
      label: '✨ Related Category',
      isTwoWay: false,
    };
  }

  return {
    score: 50,
    label: 'Explore Student',
    isTwoWay: false,
  };
}
