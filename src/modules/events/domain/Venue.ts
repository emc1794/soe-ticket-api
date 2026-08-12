export class Venue {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly address: string,
    public readonly city: string,
    public readonly capacity: number
  ) {}
}
