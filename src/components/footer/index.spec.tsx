import mount from "@test/mount";

import { Footer } from "./index";

describe("Footer component testing with enzyme", () => {
    const component = mount(<Footer />);

    it("renders without crashing", () => {
        expect(component).toBeTruthy();
    });
});
