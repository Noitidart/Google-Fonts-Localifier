// @flow

type Date = number; // Date.now()

export type Download = {
    url: string, // download url
    isDownloading: boolean,
    size?: number, // kb
    error?: string,
    createdAt: Date,
    finishedAt?: Date,
    dataurl: string // data
}

export type DownloadNoUrl = $Diff<Download, { url:string }> // TODO: flowtype object must have keys except (must have's optional)