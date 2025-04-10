"use client";
import React, {useState, useRef, useEffect} from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {motion} from "framer-motion";
import {Icons} from "@/components/icons";

// Chat component for the modal
const ModalChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! How can I help you plan your trip to Bali?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    // Simulate response after a delay
    setTimeout(() => {
      let responseText =
        "Thank you for your message! Our travel agent will get back to you shortly.";

      if (
        inputValue.toLowerCase().includes("price") ||
        inputValue.toLowerCase().includes("cost")
      ) {
        responseText =
          "Our Bali packages start from $899 for a 5-day all-inclusive trip. Would you like more details?";
      } else if (
        inputValue.toLowerCase().includes("hotel") ||
        inputValue.toLowerCase().includes("stay")
      ) {
        responseText =
          "We have partnerships with 12 luxury hotels in Bali. All 5-star rated with stunning views!";
      } else if (inputValue.toLowerCase().includes("flight")) {
        responseText =
          "We can arrange direct flights from most major cities. Would you like to check availability?";
      }

      const newResponse = {
        id: messages.length + 2,
        text: responseText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-80 border rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b flex items-center bg-gray-50 dark:bg-neutral-800">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-2">
          <Icons.chat className="w-4 h-4" />
        </div>
        <h3 className="font-medium text-sm">Travel Assistant</h3>
        <div className="flex items-center ml-auto">
          <span className="text-xs text-green-500">Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.isUser
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-gray-100 dark:bg-neutral-800"
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div className="text-xs mt-1 opacity-70 text-right">
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-gray-50 dark:bg-neutral-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-black text-white dark:bg-white dark:text-black h-10 px-3"
          >
            <Icons.send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export function AnimatedModalDemo() {
  // Placeholder image component with built-in fallback
  const PlaceholderImage = ({index}: {index: number}) => {
    return (
      <div className="rounded-lg h-20 w-20 overflow-hidden relative bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <span className="absolute text-gray-400 dark:text-gray-600 text-xs">
          Image {index}
        </span>
        <Image
          src={`/placeholders/image${index}.jpg`}
          alt={`Bali travel image ${index}`}
          width={80}
          height={80}
          className="rounded-lg h-20 w-20 object-cover flex-shrink-0"
          onError={(e) => {
            // On error, keep the placeholder visible
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Click any button below to open the modal:
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {/* Original Button with Animation */}
          <Modal>
            <ModalTrigger asChild>
              <Button
                variant="default"
                className="relative group/modal-btn bg-black dark:bg-white dark:text-black text-white hover:bg-black/90 dark:hover:bg-white/90 shadow-lg min-w-40"
              >
                <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                  Book your flight
                </span>
                <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white dark:text-black z-20">
                  ✈️
                </div>
              </Button>
            </ModalTrigger>
            <ModalBody>
              <ModalContent>
                <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                  Book your trip to{" "}
                  <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                    Bali
                  </span>{" "}
                  now! ✈️
                </h4>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-center items-center mb-4">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <motion.div
                          key={"images" + idx}
                          style={{
                            rotate: Math.random() * 20 - 10,
                          }}
                          whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                          }}
                          whileTap={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                          }}
                          className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
                        >
                          <PlaceholderImage index={idx} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-3 items-start justify-start">
                      <div className="flex items-center justify-center">
                        <PlaneIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          5 connecting flights
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <ElevatorIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          12 hotels
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <VacationIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          69 visiting spots
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <FoodIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          Good food everyday
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <MicIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          Open Mic
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <ParachuteIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          Paragliding
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <ModalChat />
                  </div>
                </div>
              </ModalContent>
              <ModalFooter className="gap-4">
                <Button
                  variant="secondary"
                  className="w-28 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="w-28 bg-black text-white dark:bg-white dark:text-black border border-black"
                >
                  Book Now
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>

          {/* Additional Button Option - More Standard */}
          <Modal>
            <ModalTrigger>
              <Button
                variant="outline"
                className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white dark:hover:text-black shadow-lg flex gap-2 items-center min-w-40"
              >
                <Icons.chat className="w-4 h-4" />
                Chat with Agent
              </Button>
            </ModalTrigger>
            <ModalBody>
              <ModalContent>
                <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                  Book your trip to{" "}
                  <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                    Bali
                  </span>{" "}
                  now! ✈️
                </h4>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-center items-center mb-4">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <motion.div
                          key={"images" + idx}
                          style={{
                            rotate: Math.random() * 20 - 10,
                          }}
                          whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                          }}
                          whileTap={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                          }}
                          className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
                        >
                          <PlaceholderImage index={idx} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-3 items-start justify-start">
                      <div className="flex items-center justify-center">
                        <PlaneIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          5 connecting flights
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <ElevatorIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          12 hotels
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <VacationIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          69 visiting spots
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <FoodIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          Good food everyday
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <MicIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          Open Mic
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <ParachuteIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          Paragliding
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <ModalChat />
                  </div>
                </div>
              </ModalContent>
              <ModalFooter className="gap-4">
                <Button
                  variant="secondary"
                  className="w-28 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="w-28 bg-black text-white dark:bg-white dark:text-black border border-black"
                >
                  Book Now
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>

          {/* Third Button Option - Bright and Obvious */}
          <Modal>
            <ModalTrigger>
              <Button
                variant="default"
                className="bg-[#34F4AF] hover:bg-[#34F4AF]/80 text-black font-semibold shadow-lg flex gap-2 items-center min-w-40"
              >
                <PlaneIcon className="w-4 h-4" />
                Open Travel Modal
              </Button>
            </ModalTrigger>
            <ModalBody>
              <ModalContent>
                <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                  Book your trip to{" "}
                  <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                    Bali
                  </span>{" "}
                  now! ✈️
                </h4>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-center items-center mb-4">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <motion.div
                          key={"images" + idx}
                          style={{
                            rotate: Math.random() * 20 - 10,
                          }}
                          whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                          }}
                          whileTap={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                          }}
                          className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
                        >
                          <PlaceholderImage index={idx} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-3 items-start justify-start">
                      <div className="flex items-center justify-center">
                        <PlaneIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          5 connecting flights
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <ElevatorIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          12 hotels
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <VacationIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          69 visiting spots
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <FoodIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          Good food everyday
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <MicIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          Open Mic
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <ParachuteIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                          Paragliding
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <ModalChat />
                  </div>
                </div>
              </ModalContent>
              <ModalFooter className="gap-4">
                <Button
                  variant="secondary"
                  className="w-28 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="w-28 bg-black text-white dark:bg-white dark:text-black border border-black"
                >
                  Book Now
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-4">
        <p>
          👆 Click any of the buttons above to open the modal dialog with chat
          interface
        </p>
      </div>
    </div>
  );
}

const PlaneIcon = ({className}: {className?: string}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
    </svg>
  );
};

const VacationIcon = ({className}: {className?: string}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17.553 16.75a7.5 7.5 0 0 0 -10.606 0" />
      <path d="M18 3.804a6 6 0 0 0 -8.196 2.196l10.392 6a6 6 0 0 0 -2.196 -8.196z" />
      <path d="M16.732 10c1.658 -2.87 2.225 -5.644 1.268 -6.196c-.957 -.552 -3.075 1.326 -4.732 4.196" />
      <path d="M15 9l-3 5.196" />
      <path d="M3 19.25a2.4 2.4 0 0 1 1 -.25a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 1 .25" />
    </svg>
  );
};

const ElevatorIcon = ({className}: {className?: string}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
      <path d="M10 10l2 -2l2 2" />
      <path d="M10 14l2 2l2 -2" />
    </svg>
  );
};

const FoodIcon = ({className}: {className?: string}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 20c0 -3.952 -.966 -16 -4.038 -16s-3.962 9.087 -3.962 14.756c0 -5.669 -.896 -14.756 -3.962 -14.756c-3.065 0 -4.038 12.048 -4.038 16" />
    </svg>
  );
};

const MicIcon = ({className}: {className?: string}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" />
      <path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515z" />
    </svg>
  );
};

const ParachuteIcon = ({className}: {className?: string}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M22 12a10 10 0 1 0 -20 0" />
      <path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
      <path d="M2 12l10 10l-3.5 -10" />
      <path d="M15.5 12l-3.5 10l10 -10" />
    </svg>
  );
};
