import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CoachInfoProps {
  coach: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function CoachInfo({ coach }: CoachInfoProps) {
  if (!coach) {
    return (
      <div className="rounded-lg border bg-white p-6 dark:bg-zinc-800">
        <h2 className="text-lg font-semibold">我的教练</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          系统暂未为您分配教练。
        </p>
      </div>
    )
  }

  const coachInitial = coach.name?.charAt(0).toUpperCase() || 'C'

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <h2 className="mb-4 text-xl font-bold">我的教练</h2>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={coach.image || undefined} alt={coach.name || 'Coach'} />
          <AvatarFallback>{coachInitial}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{coach.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {coach.email}
          </p>
        </div>
      </div>
    </div>
  )
} 