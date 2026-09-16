"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { mockRestaurants, Restaurant, MenuItem } from "@/lib/mockData";

interface RestaurantContextType {
  restaurants: Restaurant[];
  addRestaurant: (data: {
    name: string;
    ownerName: string;
    neighborhood: string;
    phone: string;
    email?: string;
    description?: string;
    descriptionSw?: string;
    image?: string;
    whatsapp?: string;
  }) => Restaurant;
  updateRestaurantDetails: (
    restaurantId: string,
    details: {
      name?: string;
      neighborhood?: string;
      phone?: string;
      whatsapp?: string;
      description?: string;
    }
  ) => void;
  addMenuItem: (
    restaurantId: string,
    item: {
      name: string;
      nameSw?: string;
      price: number;
      category: string;
      categorySw?: string;
      description?: string;
      descriptionSw?: string;
      image?: string;
      isChefSpecial?: boolean;
    }
  ) => void;
  deleteMenuItem: (restaurantId: string, menuItemId: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);

  /* Load stored dynamic restaurants on initial mount */
  useEffect(() => {
    try {
      const storedCatalog = localStorage.getItem("safeplate_restaurants_catalog");
      if (storedCatalog) {
        const parsed = JSON.parse(storedCatalog);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRestaurants(parsed);
          return;
        }
      }
      const stored = localStorage.getItem("safeplate_custom_restaurants");
      if (stored) {
        const custom = JSON.parse(stored);
        if (Array.isArray(custom) && custom.length > 0) {
          setRestaurants([...mockRestaurants, ...custom]);
        }
      }
    } catch {
      // Fallback to default mockRestaurants
    }
  }, []);

  /* Helper to persist restaurants to local storage */
  const persistCustom = (updatedAll: Restaurant[]) => {
    setRestaurants(updatedAll);
    try {
      localStorage.setItem("safeplate_restaurants_catalog", JSON.stringify(updatedAll));
      const customOnly = updatedAll.filter(
        (r) => !mockRestaurants.some((m) => m.id === r.id)
      );
      localStorage.setItem("safeplate_custom_restaurants", JSON.stringify(customOnly));
    } catch {}
  };

  const addRestaurant = (data: {
    name: string;
    ownerName: string;
    neighborhood: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    description?: string;
    descriptionSw?: string;
    image?: string;
  }): Restaurant => {
    const newRest: Restaurant = {
      id: `r-custom-${Date.now()}`,
      name: data.name,
      description:
        data.description ||
        `Authentic local eatery in ${data.neighborhood}, Arusha, serving fresh Swahili dishes daily.`,
      descriptionSw:
        data.descriptionSw ||
        `Mkahawa wa mtaani huko ${data.neighborhood}, Arusha, unaotumikia chakula safi cha Swahili kila siku.`,
      image:
        data.image ||
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      hygieneScore: 94,
      verified: true,
      rating: 4.8,
      reviewCount: 12,
      priceRange: "$$",
      avgDishPriceUSD: 3.5,
      phone: data.phone,
      whatsapp: (data.whatsapp || data.phone).replace(/[^0-9]/g, ""),
      prepTime: "15–25 min",
      distance: 1.2,
      lat: -3.375,
      lng: 36.685,
      city: "Arusha",
      neighborhood: data.neighborhood,
      categories: ["Authentic Swahili", "Local Eats"],
      categoriesSw: ["Swahili Halisi", "Vyakula vya Mtaani"],
      openNow: true,
      menu: [
        {
          id: `m-custom-default-1`,
          name: "Special Nyama Choma Plate",
          nameSw: "Sahani Maalum ya Nyama Choma",
          description: "Grilled local goat meat served with kachumbari salsa and ugali.",
          descriptionSw: "Nyama ya mbuzi iliyochomwa pamoja na kachumbari na ugali.",
          price: 4.5,
          category: "Grills",
          categorySw: "Nyama Choma",
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
          popular: true,
          isChefSpecial: true,
          spiceLevel: "mild",
        },
      ],
      verificationSteps: [],
    };

    const updated = [newRest, ...restaurants];
    persistCustom(updated);
    return newRest;
  };

  const addMenuItem = (
    restaurantId: string,
    item: {
      name: string;
      nameSw?: string;
      price: number;
      category: string;
      categorySw?: string;
      description?: string;
      descriptionSw?: string;
      image?: string;
      isChefSpecial?: boolean;
    }
  ) => {
    const newItem: MenuItem = {
      id: `m-item-${Date.now()}`,
      name: item.name,
      nameSw: item.nameSw || item.name,
      description: item.description || "Freshly prepared local dish.",
      descriptionSw: item.descriptionSw || "Chakula kilichoandaliwa hivi karibuni.",
      price: item.price,
      category: item.category,
      categorySw: item.categorySw || item.category,
      image:
        item.image ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      popular: !!item.isChefSpecial,
      isChefSpecial: !!item.isChefSpecial,
      spiceLevel: "mild",
    };

    const updated = restaurants.map((r) => {
      if (r.id === restaurantId || r.name.toLowerCase() === restaurantId.toLowerCase()) {
        const updatedMenu = [newItem, ...r.menu];
        const avgPrice =
          updatedMenu.reduce((sum, m) => sum + m.price, 0) / updatedMenu.length;
        return {
          ...r,
          menu: updatedMenu,
          avgDishPriceUSD: Number(avgPrice.toFixed(2)),
        };
      }
      return r;
    });

    persistCustom(updated);
  };

  const updateRestaurantDetails = (
    restaurantId: string,
    details: {
      name?: string;
      neighborhood?: string;
      phone?: string;
      whatsapp?: string;
      description?: string;
    }
  ) => {
    const updated = restaurants.map((r) => {
      if (r.id === restaurantId || (r.phone && details.phone && r.phone === details.phone)) {
        const cleanWhatsApp = details.whatsapp
          ? details.whatsapp.replace(/[^0-9]/g, "")
          : details.phone
          ? details.phone.replace(/[^0-9]/g, "")
          : r.whatsapp;
        return {
          ...r,
          name: details.name || r.name,
          neighborhood: details.neighborhood || r.neighborhood,
          phone: details.phone || r.phone,
          whatsapp: cleanWhatsApp,
          description: details.description || r.description,
        };
      }
      return r;
    });
    persistCustom(updated);
  };

  const deleteMenuItem = (restaurantId: string, menuItemId: string) => {
    const updated = restaurants.map((r) => {
      if (r.id === restaurantId) {
        return {
          ...r,
          menu: r.menu.filter((m) => m.id !== menuItemId),
        };
      }
      return r;
    });
    persistCustom(updated);
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        addRestaurant,
        updateRestaurantDetails,
        addMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurants must be used within a RestaurantProvider");
  }
  return context;
}
