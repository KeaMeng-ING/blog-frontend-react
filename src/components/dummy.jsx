<section className="section_container">
  <img src={post.image} alt="thumbnail" className="w-full h-auto rounded-xl" />

  <div className="space-y-5 mt-10 max-w-4xl mx-auto">
    <div className="flex-between gap-5">
      <Link
        href={`/user/${post.author?._id}`}
        className="flex gap-2 items-center mb-3"
      >
        <Image
          src={post.author.image}
          alt="avatar"
          width={64}
          height={64}
          className="rounded-full drop-shadow-lg"
        />

        <div>
          <p className="text-20-medium">{post.author.name}</p>
          <p className="text-16-medium !text-black-300">
            @{post.author.username}
          </p>
        </div>
      </Link>

      <p className="category-tag">{post.category}</p>
    </div>

    <h3 className="text-30-bold">Pitch Details</h3>
    {parsedContent ? (
      <article
        className="prose max-w-4xl font-work-sans break-all"
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />
    ) : (
      <p className="no-result">No details provided</p>
    )}
  </div>

  <hr className="divider" />

  {editorPosts?.length > 0 && (
    <div className="max-w-4xl mx-auto">
      <p className="text-30-semibold">Editor Picks</p>

      <ul className="mt-7 card_grid-sm">
        {editorPosts.map((post: StartupTypeCard, i: number) => (
          <StartupCard key={i} post={post} />
        ))}
      </ul>
    </div>
  )}

  <Suspense fallback={<Skeleton className="view_skeleton" />}>
    <View id={id} />
  </Suspense>
</section>;
