export class BlockProducer {
    public name = ""
    public producerData: any;

    public constructor(producerData: any) {
        this.name = producerData.org.candidate_name;
        this.producerData = producerData;
    }
}