import React from 'react';

export const SkeletonCard = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

export const SkeletonText = ({ lines = 1, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
    ))}
  </div>
);

export const SkeletonItinerary = () => (
  <div className="space-y-8 animate-pulse">
    {/* Header Skeleton */}
    <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl h-48"></div>
    
    {/* Timeline Skeleton */}
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
      
      <div className="space-y-12">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-start relative">
            {/* Day Number Badge Skeleton */}
            <div className="flex-shrink-0 mr-8 relative z-10">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            </div>
            
            {/* Day Content Card Skeleton */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 p-6 border-b border-gray-200">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              
              <div className="p-6 space-y-6">
                {Array.from({ length: 2 }).map((_, actIndex) => (
                  <div key={actIndex} className="flex items-start">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl mr-4"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonTrip = () => (
  <div className="animate-pulse space-y-4">
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const SkeletonProfile = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md p-6 space-y-3">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonJournal = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-white rounded-xl shadow-md">
      <div className="border-b border-gray-200">
        <div className="flex space-x-6 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
          ))}
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
          <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  </div>
);

export default {
  Card: SkeletonCard,
  Text: SkeletonText,
  Itinerary: SkeletonItinerary,
  Trip: SkeletonTrip,
  Profile: SkeletonProfile,
  Journal: SkeletonJournal,
};