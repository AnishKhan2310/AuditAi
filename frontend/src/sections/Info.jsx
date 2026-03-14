import React from "react";

const Info = () => {
  return (
    <div className="w-full flex  flex-col items-center  ">
      <h3 className="text-[34px] font-bold mb-8"> Why choose us?</h3>
      <div className="cardContainer my-4 flex gap-10 ">
        <div className="card w-[330px] h-[220px] bg-yellow-100 rounded-lg shadow-md pl-6 pr-6 pt-2 pb-6 flex flex-col justify-around hover:scale-110 transition-transform duration-300">
          <h4 className="text-2xl font-bold mb-2 flex items-center justify-center gap-4">
            <p className="text-center">Hybrid Analysis</p>
            <lord-icon
              className=""
              src="https://cdn.lordicon.com/xyvcjupc.json"
              trigger="hover"
              style={{ width: "38px", height: "38px" }}
            ></lord-icon>
          </h4>
          <p className="text-gray-600 text-lg">
            Whether it’s a standard banking PDF or a complex Web3 smart
            contract, our tool scans both the agreements in
            one place
          </p>
        </div>
        <div className="card w-[330px] h-[220px] bg-yellow-100 rounded-lg shadow-md pl-6 pr-6 pt-4 pb-6 flex flex-col justify-around hover:scale-110 transition-transform duration-300">
          <h4 className="text-2xl font-bold mb-2 flex items-center justify-center  gap-4">
            <p className="text-center">Risk Scoring</p>
            <lord-icon
              className=""
              src="https://cdn.lordicon.com/gfpplxaf.json"
              trigger="hover"
              style={{ width: "38px", height: "38px" }}
            ></lord-icon>
          </h4>
          <p className="text-gray-600 text-lg">
            Get an instant safety score from 0 to 100. We scan for hidden fees, rug-pull patterns, and pyellowatory clauses that others miss.
          </p>
        </div>
        <div className="card w-[330px] h-[220px] bg-yellow-100 rounded-lg shadow-md pl-6 pr-6 pt-4 pb-6 flex flex-col justify-around hover:scale-110 transition-transform duration-300">
          <h4 className="text-2xl font-bold mb-2 flex  gap-4 items-center justify-center">
            <p className="text-center">AI Chatbot</p>
            <lord-icon
              className=""
              src="https://cdn.lordicon.com/fmrnjmev.json"
              trigger="hover"
              style={{ width: "38px", height: "38px" }}
            ></lord-icon>
          </h4>
          <p className="text-gray-600 text-lg">
           Ask our RAG-poweyellow chatbot anything about your contract to get instant, plain English explanations.
          </p>
        </div>
        
      </div>
     

        <div className="stats w-full my-24  h-[180px] bg-yellow-200 flex items-center justify-around rounded-lg shadow-md">

                <div className="small flex flex-col items-center justify-center ">
                    <h5 className="text-6xl font-bold my-2">90%+</h5>
                    <p className="text-2xl">Accuracy Rate</p>
                </div>
                <div className="small flex flex-col items-center justify-center ">
                    <h5 className="text-6xl font-bold my-2">$0</h5>
                    <p className="text-2xl">Free of Cost</p>
                </div>
                <div className="small flex flex-col items-center justify-center ">
                    <h5 className="text-6xl font-bold my-2">&lt;8s</h5>
                    <p className="text-2xl">Response Time</p>
                </div>
                <div className="small flex flex-col items-center justify-center ">
                    <h5 className="text-6xl font-bold my-2">100%</h5>
                    <p className="text-2xl">Satisfaction</p>
                </div>

        </div>

        <div className="relative" >
            <h3 className="text-[34px] font-bold mb-12 w-full text-center">How it works?</h3>
            <div className="flex gap-24 mt-4 mb-8">
                <div className="w-[350px] p-5  flex flex-col items-center justify-center rounded-lg  gap-4 bg-yellow-100 hover:scale-110 transition-transform duration-300">
                    <div className="circle w-[80px] h-[80px] bg-yellow-950 rounded-full">
                    <p className="text-white text-2xl font-bold flex items-center justify-center h-full">1</p>
                </div>
                <h4 className="text-2xl">
                    Upload your contract
                </h4>
                <p className="text-gray-600 text-lg">
                    
                </p>
                </div>

                
                 <div className="w-[350px]  flex flex-col items-center justify-center rounded-lg bg-yellow-100  gap-2 hover:scale-110 transition-transform duration-300">
                    <div className="circle w-[80px] h-[80px] bg-yellow-950 rounded-full">
                    <p className="text-white text-2xl font-bold flex items-center justify-center h-full">2</p>
                </div>
                <h4 className="text-2xl">
                    Detailed Analysis Dashboard
                </h4>
                <p className="text-gray-600 text-lg">
                    
                </p>
                </div>

                 <div className="w-[350px] flex flex-col items-center justify-center rounded-lg bg-yellow-100 gap-2 hover:scale-110 transition-transform duration-300">
                    <div className="circle w-[80px] h-[80px] bg-yellow-950 rounded-full">
                    <p className="text-white text-2xl font-bold flex items-center justify-center h-full">3</p>
                </div>
                <h4 className="text-2xl">
                    AI Chatbot Support
                </h4>
                <p className="text-gray-600 text-lg">
                    
                </p>
                </div>

            </div>

        </div>
        <div className="w-[75vw] h-[2px] bg-yellow-950 mt-8"></div>
        <section id="pricing" className="py-20 bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

       
       
      </div>
    </section>

    </div>
  );
};

export default Info;