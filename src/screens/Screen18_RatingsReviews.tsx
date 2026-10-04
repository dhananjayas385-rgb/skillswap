import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Star, Send, Award, CheckCircle } from 'lucide-react';

export const Screen18_RatingsReviews: React.FC = () => {
  const {
    screenParams,
    exchanges,
    currentUser,
    users,
    skillOffers,
    reviews,
    submitReview,
    navigate,
    showToast,
  } = useApp();

  const exchangeId =
    screenParams?.exchangeId || exchanges[0]?.id;

  const exchange =
    exchanges.find((e) => e.id === exchangeId) ||
    exchanges[0];

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!exchange) {
    return (
      <div className="p-8 text-center text-slate-400">
        No exchange found for review
      </div>
    );
  }

  const isStudent1 =
    exchange.student1Id === currentUser?.id;

  const partnerId = isStudent1
    ? exchange.student2Id
    : exchange.student1Id;

  const partner = users.find(
    (u) => u.id === partnerId
  );

  const learnedSkill = skillOffers.find(
    (s) =>
      s.id ===
      (isStudent1
        ? exchange.skill2Id
        : exchange.skill1Id)
  );

  // Check whether the current user has already reviewed this partner
  const existingReview = reviews.find(
    (r) =>
      r.exchangeId === exchange.id &&
      r.reviewerId === currentUser?.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      showToast(
        'Please write a brief feedback comment',
        'error'
      );
      return;
    }

    if (!partner) {
      showToast(
        'Partner information could not be found',
        'error'
      );
      return;
    }

    if (existingReview) {
      showToast(
        'You have already submitted a review',
        'info'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      submitReview({
        exchangeId: exchange.id,
        revieweeId: partner.id,
        rating,
        comment: comment.trim(),
      });

      setIsSubmitting(false);

      showToast(
        'Review submitted successfully! ⭐'
      );

      navigate('MY_EXCHANGES');
    }, 600);
  };

  return (
    <div className="min-h-screen p-5 flex flex-col justify-between bg-slate-950 pb-20 animate-fade-in gap-5">
      <div className="flex flex-col gap-5">

        {/* Header */}
        <div className="flex flex-col gap-1 text-center pt-2">
          <h1 className="text-xl font-black text-slate-100 flex items-center justify-center gap-2">
            Rate Your Exchange
            <Award className="w-5 h-5 text-amber-400" />
          </h1>

          <p className="text-xs text-slate-400">
            Share your peer learning feedback & rate your mentor
          </p>
        </div>

        {/* Partner Banner */}
        <div className="glass-card p-5 rounded-3xl border border-indigo-900/40 flex flex-col items-center text-center gap-3">

          <img
            src={
              partner?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
            }
            alt={partner?.name || 'Partner'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-lg"
          />

          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400">
              Reviewing Peer Mentor
            </span>

            <span className="font-bold text-slate-100 text-base">
              {partner?.name || 'Peer Mentor'}
            </span>

            <span className="text-xs text-indigo-300 font-semibold">
              Taught: {learnedSkill?.skillName || 'Skill'}
            </span>
          </div>
        </div>

        {/* Already Reviewed */}
        {existingReview ? (
          <div className="glass-card p-6 rounded-3xl border border-emerald-900/50 text-center flex flex-col items-center gap-3">

            <CheckCircle className="w-10 h-10 text-emerald-400" />

            <h3 className="text-base font-bold text-slate-100">
              Review Already Submitted!
            </h3>

            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= existingReview.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-slate-300 italic">
              "{existingReview.comment}"
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate('MY_EXCHANGES')
              }
            >
              Return to My Exchanges
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >

            {/* Star Rating */}
            <div className="glass-card p-5 rounded-3xl border border-slate-800 flex flex-col items-center gap-3">

              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Star Rating
              </span>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setRating(star)
                    }
                    className="p-1 hover:scale-125 active:scale-110 transition-transform"
                    aria-label={`Give ${star} star${
                      star > 1 ? 's' : ''
                    }`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-amber-400">
                {rating === 5 &&
                  'Outstanding Mentor! 🌟'}

                {rating === 4 &&
                  'Great Experience! 👍'}

                {rating === 3 &&
                  'Good Exchange 😊'}

                {rating === 2 &&
                  'Needs Improvement'}

                {rating === 1 &&
                  'Needs Significant Improvement'}
              </span>
            </div>

            {/* Written Review */}
            <div className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col gap-2">

              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Written Review & Feedback
              </label>

              <textarea
                rows={4}
                maxLength={500}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
                placeholder="How was their teaching style? Did they help you achieve your goals?"
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
              />

              <div className="flex justify-end">
                <span className="text-[10px] text-slate-600">
                  {comment.length}/500
                </span>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={
                <Send className="w-4 h-4" />
              }
              disabled={isSubmitting}
            >
              Submit Rating & Finish
            </Button>

          </form>
        )}
      </div>
    </div>
  );
};