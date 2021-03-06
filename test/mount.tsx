import React, {ReactChild, ReactChildren} from "react";
import { mount as mountBase, MountRendererProps, ReactWrapper } from "enzyme";

import { Provider } from 'react-redux'
import store from '@redux/store'



/**
 * Custom renderer example with enzyme
 * You can customize it to your needs.
 *
 * To learn more about customizing renderer,
 * please visit https://enzymejs.github.io/enzyme/
 */
interface providerProps {
    children: ReactChild | ReactChildren;
}

const AllTheProviders = ({ children } : providerProps)  => {


    return (
        <>
            <Provider store={store}>
                {children}
            </Provider>
        </>
    );
};


const mount: (node: ReactChild | ReactChildren, options?: MountRendererProps) => ReactWrapper = (
    node,
    options,
) => {
    return mountBase(<AllTheProviders>{node}</AllTheProviders>, options);
};

// override render method
export default mount;
