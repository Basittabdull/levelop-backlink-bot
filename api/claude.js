export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action } = req.body;

  try {
    // Generate article via Groq
    if (action === 'generate') {
      const GROQ_API_KEY = process.env.GROQ_API_KEY;
      if (!GROQ_API_KEY) return res.status(500).json({ error: 'GROQ_API_KEY not set in environment variables' });

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: req.body.max_tokens || 1000,
          messages: [{ role: 'user', content: req.body.prompt }]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || JSON.stringify(data));
      return res.status(200).json({ text: data.choices[0].message.content });
    }

    // Publish to Dev.to
    if (action === 'publish_devto') {
      const { apiKey, title, body, tags, canonical_url } = req.body;
      const response = await fetch('https://dev.to/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({ article: { title, body_markdown: body, published: true, tags: tags.slice(0, 4), canonical_url } })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || JSON.stringify(data));
      return res.status(200).json({ url: data.url });
    }

    // Publish to Hashnode
    if (action === 'publish_hashnode') {
      const { apiKey, publicationId, title, body, canonical_url } = req.body;
      const response = await fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': apiKey },
        body: JSON.stringify({
          query: `mutation PublishPost($input: PublishPostInput!) { publishPost(input: $input) { post { url } } }`,
          variables: { input: { title, contentMarkdown: body, publicationId, tags: [], originalArticleURL: canonical_url } }
        })
      });
      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].message);
      return res.status(200).json({ url: data.data?.publishPost?.post?.url || 'https://hashnode.com' });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
