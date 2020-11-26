import { LibsType } from '../global-libs';
import SVGO from 'svgo';

export type InputDataType = Array<
  Record<string, any> & {
    type: string;
    value: { url: string } & { [key: string]: any };
  }
>;
type OutputDataUnwrapped = Array<Omit<InputDataType[0], 'value'> & { value: { content: string } }>;
export type OutputDataType = Promise<OutputDataUnwrapped>;
export type OptionsType =
  | undefined
  | {
      svgo?: SVGO.Options;
    };

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { SVGO, _, SpServices }: Pick<LibsType, 'SVGO' | '_' | 'SpServices'>,
): OutputDataType {
  try {
    const optimizer = new SVGO(options?.svgo || {});
    return (await Promise.all(
      tokens.map(async (token: InputDataType[0]) => {
        if (token.type && token.type === 'vector') {
          const baseString = await SpServices.assets.getSource<string>(token.value.url, 'text');
          return optimizer
            .optimize(baseString)
            .then(({ data }) => {
              return { ...token, value: { content: data } };
            })
            .catch(() => {
              return { ...token, value: { content: baseString } };
            });
        }
        return token;
      }),
    )) as OutputDataUnwrapped;
  } catch (err) {
    throw err;
  }
}