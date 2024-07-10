import React, { createContext, useContext, useState, ReactNode } from "react";

interface CreatePostContextType {
  selectedBook: any;
  setSelectedBook: (book: any) => void;
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(
  undefined
);

export const CreatePostProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  console.log("selectedBook", selectedBook);

  return (
    <CreatePostContext.Provider value={{ selectedBook, setSelectedBook }}>
      {children}
    </CreatePostContext.Provider>
  );
};

export const useCreatePost = () => {
  const context = useContext(CreatePostContext);
  if (context === undefined) {
    throw new Error(
      "useCreatePostContext must be used within a CreatePostProvider"
    );
  }
  return context;
};
