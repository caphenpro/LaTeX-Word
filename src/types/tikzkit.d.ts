declare module '@gezhi-io/tikzkit' {
  export interface TikzConvertResult {
    svg: string;
    diagnostics?: unknown[];
    ast?: unknown;
    ir?: unknown;
  }

  export function convertTikzToSvg(tikzCode: string): TikzConvertResult;
  export function tikzToSvg(tikzCode: string): TikzConvertResult;
  export function convertTikzToSvgAsync(tikzCode: string): Promise<TikzConvertResult>;
  export function tikzToSvgAsync(tikzCode: string): Promise<TikzConvertResult>;
}
