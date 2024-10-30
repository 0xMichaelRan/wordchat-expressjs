const { Pinecone } = require('@pinecone-database/pinecone');

class PineconeService {
  constructor() {
    this.pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });
    this.index = this.pc.index(process.env.PINECONE_INDEX);
  }

  async getEmbedding(text) {
    const embedding = await this.pc.inference.embed(
      process.env.PINECONE_MODEL,
      [text],
      { inputType: 'query' }
    );
    return embedding[0].values;
  }

  async getPassageEmbeddings(texts) {
    return await this.pc.inference.embed(
      process.env.PINECONE_MODEL,
      texts,
      { inputType: 'passage', truncate: 'END' }
    );
  }

  async queryByVector(vector, knowledge_base, topK = 10) {
    return await this.index.namespace(knowledge_base).query({
      vector,
      topK,
      includeMetadata: true
    });
  }

  async queryById(id, knowledge_base, topK = 10) {
    return await this.index.namespace(knowledge_base).query({
      id: `word_0${id}`,
      topK,
      includeMetadata: true
    });
  }

  async upsertVectors(vectors, knowledge_base) {
    await this.index.namespace(knowledge_base).upsert(vectors);
  }
}

// Export as singleton
module.exports = new PineconeService();