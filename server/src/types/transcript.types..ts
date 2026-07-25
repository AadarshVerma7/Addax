export interface TranscriptSegment{
    text : string,
    startTime : number,
    endTime : number,
    duration : number,
}

export interface TranscriptChunk{
    content : string,
    startTime :  number,
    endTime : number,
    chunkIndex : number,
    embedding: number[],
}