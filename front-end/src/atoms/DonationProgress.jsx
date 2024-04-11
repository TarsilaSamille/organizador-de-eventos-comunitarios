export const DonationProgress = ({ title, progress, goal }) => (
  <>
    <div className="flex gap-5 px-px mt-8 w-full text-base leading-6 text-purple-950">
      <div className="flex-auto font-semibold">{title}</div>
      <div className="flex gap-0.5 self-start whitespace-nowrap">
        <div className="grow">{progress}</div>
        <div>%</div>
      </div>
    </div>
    <div className="flex flex-col justify-center mt-2.5 bg-red-100 rounded-full">
      <div
        className="shrink-0 h-2 bg-purple-700"
        style={{ width: `${progress}%` }}
      />
    </div>
    <div className="mt-3 text-sm tracking-wide leading-5 text-purple-950">
      Objetivo: R$ {goal}
    </div>
  </>
);
