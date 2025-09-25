import IconSearch from "/src/assets/svg/search.svg";

const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search
}) => {
    return (
        <div className="input-wrapper_inputWrapper slots-filters_searchSectionGamesInput input-wrapper_default">
            <div>
                <label className="input-wrapper_inputWrapperLabel">
                    <span className="input-wrapper-prefix_inputWrapperPrefix">
                        <img src={IconSearch} />
                    </span>
                    <span className="input-wrapper_inputWrapperInput">
                        <input
                            ref={searchRef}
                            className="input_input"
                            type="text"
                            name="slots-search"
                            placeholder="Search games (minimum 3 characters)"
                            onChange={(event) => {
                                setTxtSearch(event.target.value);
                            }}
                            onKeyUp={(event) => {
                                if (event.target.value.length > 2) {
                                    search(event);
                                }
                            }}
                            value={txtSearch}
                        />
                        <span className="input-wrapper-label_inputWrapperLabel input-wrapper_inputWrapperLabelText">
                            <span>Search games (minimum 3 characters)</span>
                        </span>
                    </span>
                </label>
            </div>
            <fieldset className="input-wrapper_inputWrapperFieldset input-wrapper_hasLabel">
                <legend className="input-wrapper_inputWrapperLegend"><span>Search games (minimum 3 characters)</span></legend>
            </fieldset>
        </div>
    );
};

export default SearchInput;