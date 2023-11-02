// npm i use-places-autocomplete
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';


function PlacesAutoComplete({ handleSetSelected }) {

    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions
    } = usePlacesAutocomplete();

    const handleSelectLocation = async (address) => {
        console.log(address);
        
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = getLatLng(results[0]);
        // console.log({ lat, lng })

        handleSetSelected({ lat, lng });
    };

    if (!ready) return null;

    return (
        <div className='relative'>
            <input
                value={value}
                disabled={!ready}
                onChange={(e) => setValue(e.target.value)}
            />
            <div className='result-container'>
                {status === 'OK' && data.map(({ place_id, description }) => {
                    return (
                        <div key={place_id} className='item'
                            onClick={() => handleSelectLocation(description)}
                        >
                            {description}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default PlacesAutoComplete;