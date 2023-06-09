import { useLocation } from "react-router-dom";
import axios from "axios";
import React, { useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import { apiAuthorize } from "../../constants/apiAuthorize";
import AccordionCard from "../components/AccordionCard";
import ImageTop from "../../images/Flying around the world-amico.svg";
import SearchBar from "../components/SearchBar";

export default function Detail() {
  // ----------------------------------------------------------------
  // useState
  // ----------------------------------------------------------------
  const [flightDatas, setFlightDatas] = React.useState<Flight[]>([]);
  // ----------------------------------------------------------------
  // useEffect
  // ----------------------------------------------------------------
  useEffect(() => {
    (async () => {
      await fetchOnewayFlightData(
        originalLocationCode,
        destinationLocationCode,
        departureDate,
        adultNumber,
        childNumber,
        travelClass
      );
    })();
  }, []);

  console.log("flightDatas", flightDatas);

  // ----------------------------------------------------------------
  // Type
  // ----------------------------------------------------------------
  interface Segment {
    aircraft: {
      code: string;
    };
    arrival: {
      iataCode: string;
      terminal: string;
      at: string;
    };
    carrierCode: string;
    departure: {
      iataCode: string;
      terminal: string;
      at: string;
    };
    numberOfStops: number;
  }

  interface Itineraries {
    segments: Segment[];
  }

  interface Flight {
    id: number;
    itineraries: Itineraries[];
    numberOfBookableSeats: number;
    oneWay: boolean;
    price: {
      base: string;
      currency: string;
      grandTotal: string;
    };
    travelerPricings: Array<object>;
  }

  // ----------------------------------------------------------------
  // function
  // ----------------------------------------------------------------
  const useQueryParams = () => {
    const location = useLocation();
    return new URLSearchParams(location.search);
  };

  const params = useQueryParams();

  const originalLocationCode = params.get("originalLocationCode");
  const destinationLocationCode = params.get("destinationLocationCode");
  const departureDate = params.get("departureDate");
  // const returnDate = params.get("returnDate");
  const adultNumber = params.get("adultNumber");
  const childNumber = params.get("childNumber");
  const travelClass = params.get("travelClass");

  const fetchOnewayFlightData = async (
    originalLocationCode: any,
    destinationLocationCode: any,
    departureDate: any,
    adultNumber: any,
    childNumber: any,
    travelClass: any
  ) => {
    try {
      const accessToken = await apiAuthorize();
      const res = await axios.get(
        `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originalLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&adults=${adultNumber}&children=${childNumber}&travelClass=${travelClass}&nonStop=false&currencyCode=CAD&max=20`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = res.data.data;
      setFlightDatas(result);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchRoundFlightData = async (
  //   originalLocationCode: any,
  //   destinationLocationCode: any,
  //   departureDate: any,
  //   returnDate: any,
  //   adultNumber: any,
  //   childNumber: any,
  //   travelClass: any
  // ) => {
  //   try {
  //     const accessToken = await apiAuthorize();
  //     const res = await axios.get(
  //       `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originalLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adultNumber}&children=${childNumber}&travelClass=${travelClass}&nonStop=false&currencyCode=USD&max=250`,

  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     const result = res.data.data;
  //     setFlightDatas(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="min-h-screen overflow-auto">
      {/* <SearchBar
        preOriginalLocationCode={originalLocationCode}
        preDestinationLocationCode={destinationLocationCode}
        preDepartureDate={departureDate}
        preAdultNumber={adultNumber}
        preChildNumber={childNumber}
        preTravelClass={travelClass}
      /> */}
      <div className="flex justify-center my-8">
        <img src={ImageTop} alt="top" className="w-1/6 " />
      </div>
      <div className="flex pb-12 px-28 text-2xl items-center gap-2">
        <StarIcon />
        <div>20 Best flights</div>
      </div>
      <div className="pb-12 px-28">
        {flightDatas.map((flightData, index) => (
          <AccordionCard key={index} information={flightData} />
        ))}
      </div>
    </div>
  );
}
