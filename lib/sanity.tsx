import {
  createClient,
  createPortableTextComponent,
  createImageUrlBuilder,
  createPreviewSubscriptionHook
} from "next-sanity";
//import ReactTooltip from "react-tooltip";

import { config } from "./config";
import {SanityImageSource} from "@sanity/image-url/lib/types/types";
import {ImageUrlBuilder} from "@sanity/image-url/lib/types/builder";
import {SanityClient} from "@sanity/client";

if (!config.projectId) {
  throw Error(
    "The Project ID is not set. Check your environment variables."
  );
}
export const urlFor = (source: SanityImageSource): ImageUrlBuilder =>
  createImageUrlBuilder(config).image(source);

export const imageBuilder = (source: SanityImageSource): ImageUrlBuilder =>
  createImageUrlBuilder(config).image(source);

export const usePreviewSubscription =
  createPreviewSubscriptionHook(config);

// Set up Portable Text serialization
export const PortableText = createPortableTextComponent({
  ...config,
  // Serializers passed to @sanity/block-content-to-react
  // (https://github.com/sanity-io/block-content-to-react)
  serializers: {
    types: {
      code: (props : { node: { language: string, code: string } }) => {
        return <pre data-language={props.node.language}><code>{props.node.code}</code></pre>
      }


    },
  }
});

export const client = createClient(config);

export const previewClient = createClient({
  ...config,
  useCdn: false
});

export const getClient = (usePreview: boolean|undefined): SanityClient =>
  usePreview ? previewClient : client;
export default client;