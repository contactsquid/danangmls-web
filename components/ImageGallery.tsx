'use client';

interface Props {
  images: string[];
  title: string;
  altPrefix?: string;
}

export default function ImageGallery({ images, title, altPrefix }: Props) {
  if (images.length === 0) return null;

  return (
    <div className={`grid gap-1 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {images.slice(0, 4).map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={img}
          alt={`${altPrefix || title} — photo ${i + 1}`}
          className="w-full aspect-video object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ))}
    </div>
  );
}
