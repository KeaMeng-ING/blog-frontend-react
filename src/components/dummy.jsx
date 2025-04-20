{
  sameAuthorBlogs.length > 0 ? (
    <div className="max-w-4xl mx-auto">
      <p className="font-semibold text-[30px] text-black">
        More From The Same Author
      </p>
      <div className="horizontal-scroll-container">
        <ul className="horizontal-card-grid">
          {sameAuthorBlogs.map((post, i) => (
            <BlogCard key={i} post={post} className={"startup-card"} />
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <p className="font-semibold text-[30px] text-black">Featured Post</p>
      <div className="horizontal-scroll-container">
        <ul className="horizontal-card-grid">
          {shuffledPosts.map((post, i) => (
            <BlogCard key={i} post={post} className={"startup-card"} />
          ))}
        </ul>
      </div>
    </div>
  );
}
