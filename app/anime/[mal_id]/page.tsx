import ImageSide from '@/components/common/Anime/ImageSide'
import Trailer from '@/components/common/Anime/Trailer'
import Pill from '@/components/common/Pill'
import { fetchAnimeById } from '@/lib/api'

export async function generateMetadata({ params }: { params: Promise<{ mal_id: number }> }) {
  const { mal_id } = await params
  const { data } = await fetchAnimeById({ mal_id })

  return {
    title: `${data.title} | Kami Hub`,
    description: data.synopsis?.slice(0, 160),
    openGraph: {
      title: `${data.title} | Kami Hub`,
      description: data.synopsis ?? `Information about the anime ${data.title} on Kami Hub.`,
      images: data.images.webp.image_url ? [
        {
          url: data.images.webp.image_url,
          width: 800,
          height: 600,
          alt: data.title,
        }
      ] : undefined,
    },
    twitter: {
      title: `${data.title} | Kami Hub`,
      description: data.synopsis ?? `Information about the anime ${data.title} on Kami Hub.`,
      images: data.images.webp.image_url ? [data.images.webp.image_url] : undefined,
    },
    alternates: {
      canonical: `https://kamihub.vercel.app/anime/${mal_id}`,
    },
    keywords: [
      data.title,
      data.title_english,
      data.season,
    ].filter(Boolean)
  }
}

export default async function page({ params }: { params: Promise<{ mal_id: number }> }) {
  const { mal_id } = await params
  const { data } = await fetchAnimeById({ mal_id })

  return (
    <main className='min-h-svh spacing-x pt-24'>
      <div className='flex flex-col justify-center sm:flex-row sm:items-start gap-5 w-full'>
        <div className='block sm:hidden'>
          <div>
            <h1 className='text-2xl font-bold'>{data.title}</h1>
            <p className='text-text/50'>{data.title_english}</p>
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {data.season && <Pill className='bg-accent/70 border-accent'>{data.season} {data.year}</Pill>}
            {data.genres.map((genre) => (
              <Pill key={genre.mal_id} className='bg-primary/70 border-primary'>{genre.name}</Pill>
            ))}
          </div>
        </div>
        <ImageSide data={data} />
        <div className='flex flex-col gap-2 w-full'>
          <div className='hidden sm:block'>
            <div>
              <h1 className='text-4xl font-bold'>{data.title}</h1>
              <p className='text-text/50'>{data.title_english}</p>
            </div>
            <div className='flex gap-2 mt-2'>
              {data.season && <Pill className='bg-accent/70 border-accent'>{data.season} {data.year}</Pill>}
              {data.genres.map((genre) => (
                <Pill key={genre.mal_id} className='bg-primary/70 border-primary'>{genre.name}</Pill>
              ))}
            </div>
          </div>
          <p>{data.synopsis}</p>
          <h3 className='text-2xl font-bold mt-2'>Details</h3>
          <div className='flex flex-wrap gap-2'>
            <Pill className='bg-primary/70 border-primary'>Type: {data.type}</Pill>
            {data.episodes && <Pill className='bg-primary/70 border-primary'>Episodes: {data.episodes}</Pill>}
            <Pill className='bg-primary/70 border-primary'>Status: {data.status}</Pill>
            <Pill className='bg-primary/70 border-primary'>Duration: {data.duration}</Pill>
            {data.rating && <Pill className='bg-primary/70 border-primary'>Rating: {data.rating}</Pill>}
          </div>
          {data.trailer && data.trailer.embed_url && (
            <Trailer url={data.trailer.embed_url } />
          )}
        </div>
      </div>
    </main>
  )
}
