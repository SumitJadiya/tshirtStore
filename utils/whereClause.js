class WhereClause {
  constructor(base, bigQ) {
    this.base = base
    this.bigQ = bigQ
  }

  search() {
    const searchWord = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: 'i',
          },
        }
      : {}

    this.base = this.base.find({ ...searchWord })
    return this
  }
}
