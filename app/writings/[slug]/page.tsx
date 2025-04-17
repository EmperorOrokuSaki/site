import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Mock data for blog posts - in a real app, this would come from a database or CMS
const blogPosts = {
  "understanding-modern-memory-management": {
    title: "Understanding Modern Memory Management: A Deep Dive",
    date: "2023-05-15",
    content: `
# Understanding Modern Memory Management: A Deep Dive

Memory management is one of the most critical aspects of systems programming. In this article, we'll explore how modern programming languages handle memory allocation and deallocation, with a focus on ownership models and borrowing rules.

## Traditional Memory Management

In languages like C and C++, memory management is manual. Developers are responsible for allocating memory with \`malloc\` or \`new\` and deallocating it with \`free\` or \`delete\`. This approach offers maximum control but is prone to errors like:

- Memory leaks (forgetting to free memory)
- Use-after-free bugs
- Double-free errors
- Buffer overflows

## Garbage Collection

Languages like Java, JavaScript, and Python use garbage collection. The runtime automatically tracks object references and frees memory when objects are no longer reachable. While this eliminates many memory-related bugs, it introduces:

- Non-deterministic cleanup
- Potential performance pauses
- Higher memory overhead
- Less control over resource usage

## Modern Ownership Models

Modern systems languages have introduced ownership models that provide memory safety without garbage collection:

\`\`\`rust
fn main() {
    // 'message' is the owner of this string
    let message = String::from("Hello, world!");
    
    // Ownership is moved to the function
    print_message(message);
    
    // This would cause a compile error - ownership was moved
    // println!("{}", message);
}

fn print_message(msg: String) {
    println!("{}", msg);
    // 'msg' is dropped (freed) when this function ends
}
\`\`\`

### Borrowing Rules

Borrowing allows temporary access to data without transferring ownership:

\`\`\`rust
fn main() {
    let message = String::from("Hello, world!");
    
    // Borrow the string (reference) - doesn't transfer ownership
    print_message_length(&message);
    
    // Still valid - we still own 'message'
    println!("{}", message);
}

fn print_message_length(msg: &String) {
    println!("Length: {}", msg.len());
    // No need to free anything - we just borrowed it
}
\`\`\`

## Conclusion

Modern memory management systems provide safety without sacrificing performance. By enforcing ownership and borrowing rules at compile time, they eliminate entire categories of memory-related bugs while maintaining predictable performance characteristics.
    `,
    tags: ["systems", "memory-safety"],
  },
  "building-high-performance-web-servers": {
    title: "Building High-Performance Web Servers with Modern Tools",
    date: "2023-03-22",
    content: `
# Building High-Performance Web Servers with Modern Tools

Creating high-performance web servers requires understanding both the underlying protocols and the tools available for implementation. This article explores modern approaches to building blazing-fast web servers.

## Async I/O

Modern web servers leverage asynchronous I/O to handle thousands of concurrent connections efficiently:

\`\`\`rust
async fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).await.unwrap();
    
    let response = "HTTP/1.1 200 OK\\r\\n\\r\\nHello, World!";
    stream.write(response.as_bytes()).await.unwrap();
    stream.flush().await.unwrap();
}
\`\`\`

## Event-Driven Architecture

Event loops and non-blocking I/O allow servers to handle many connections with minimal resource usage:

\`\`\`javascript
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello, World!');
});

server.listen(8000);
console.log('Server running on port 8000');
\`\`\`

## Zero-Copy Optimizations

Modern APIs allow data to be sent directly from disk to network without unnecessary copying:

\`\`\`c
sendfile(socket_fd, file_fd, &offset, count);
\`\`\`

## Conclusion

By leveraging async I/O, event-driven architectures, and zero-copy optimizations, modern web servers can achieve remarkable performance with minimal resource usage.
    `,
    tags: ["performance", "async", "web"],
  },
  "language-migration-guide": {
    title: "Language Migration Guide for Systems Programmers",
    date: "2023-01-10",
    content: `
# Language Migration Guide for Systems Programmers

Migrating from one programming language to another is a significant undertaking, especially for systems-level code. This guide provides strategies for successful migrations.

## Incremental Migration

Rather than rewriting everything at once, consider an incremental approach:

1. Identify self-contained modules
2. Rewrite one module at a time
3. Create FFI (Foreign Function Interface) bridges between languages
4. Test thoroughly at each step

## Performance Considerations

When migrating, be aware of performance characteristics:

\`\`\`
| Operation          | C/C++  | Rust   | Go     |
|--------------------|--------|--------|--------|
| Raw computation    | ★★★★★  | ★★★★★  | ★★★    |
| Memory usage       | ★★★★★  | ★★★★   | ★★★    |
| Concurrency        | ★★     | ★★★★   | ★★★★★  |
| Startup time       | ★★★★★  | ★★★★   | ★★★    |
\`\`\`

## Case Study: Database Engine Migration

A database engine migration might follow these steps:

1. Start with query parser and planner
2. Move to storage engine
3. Finally migrate transaction manager
4. Maintain compatibility throughout

## Conclusion

Successful language migrations require careful planning, incremental approaches, and thorough testing. By understanding the strengths and weaknesses of each language, you can make informed decisions about which parts to migrate first and how to structure the transition.
    `,
    tags: ["languages", "migration", "systems"],
  },
}

// Get the blog post data based on the slug
export default function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params
  const post = blogPosts[slug as keyof typeof blogPosts]

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono p-4">
        <div className="container mx-auto">
          <header className="flex items-center border-b border-green-700 pb-4">
            <Link href="/" className="text-green-300 hover:text-green-100 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>cd ..</span>
            </Link>
          </header>
          <main className="py-8">
            <div className="border border-green-700 p-4">
              <h1 className="text-xl text-green-300 mb-4">Error 404: File Not Found</h1>
              <p>The requested blog post does not exist.</p>
              <div className="mt-4">
                <Link
                  href="/#writings"
                  className="border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
                >
                  Return to writings
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="container mx-auto">
        <header className="flex items-center border-b border-green-700 pb-4">
          <Link href="/#writings" className="text-green-300 hover:text-green-100 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>cd ~/nima/writings</span>
          </Link>
        </header>
        <main className="py-8">
          <article className="border border-green-700">
            <div className="border-b border-green-700 bg-green-900/20 p-4">
              <div className="text-xs mb-2">{post.date}</div>
              <h1 className="text-xl text-green-300">{post.title}</h1>
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="border border-green-700 px-2 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-black prose-pre:border prose-pre:border-green-700">
                {post.content.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={i} className="text-xl text-green-300 mt-6 mb-4">
                        {line.substring(2)}
                      </h1>
                    )
                  } else if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} className="text-lg text-green-300 mt-5 mb-3">
                        {line.substring(3)}
                      </h2>
                    )
                  } else if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} className="text-base text-green-300 mt-4 mb-2">
                        {line.substring(4)}
                      </h3>
                    )
                  } else if (line.startsWith("```")) {
                    return (
                      <pre key={i} className="bg-black border border-green-700 p-4 my-4 overflow-x-auto">
                        <code>{line.substring(3)}</code>
                      </pre>
                    )
                  } else if (line === "") {
                    return <br key={i} />
                  } else {
                    return (
                      <p key={i} className="my-2">
                        {line}
                      </p>
                    )
                  }
                })}
              </div>
            </div>
          </article>
          <div className="mt-8 text-center">
            <Link
              href="/#writings"
              className="inline-block border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
            >
              cd ~/nima/writings
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
