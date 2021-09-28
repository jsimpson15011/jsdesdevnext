import mount from "@test/mount";

import { Header } from "./index";

describe("Header component testing with testing-library", () => {
    const component = mount(<Header />);

    it("renders without crashing", () => {
        expect(component).toBeTruthy();
    });
});
