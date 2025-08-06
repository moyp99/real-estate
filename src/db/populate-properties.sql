-- Populate Supabase database with mock properties data
-- This script should be run in the Supabase SQL editor


-- Insert properties
INSERT INTO public.properties (
    id, title, price, address, city, state, zip_code, bedrooms, bathrooms, 
    sqft, lot_size, year_built, property_type, status, description, features, 
    agent_id, latitude, longitude, days_on_market, mls_number, virtual_tour_url
) VALUES
(1, 'Stunning Ocean View Home in La Jolla', 875000, '7842 Eads Avenue', 'La Jolla', 'CA', '92037', 3, 2.0, 1850, '0.25 acres', 2018, 'Single Family', 'For Sale', 'Beautiful modern home with breathtaking ocean views. This stunning property features an open floor plan, gourmet kitchen with quartz countertops, and a master suite with panoramic views. Located in the prestigious La Jolla area, just minutes from the beach.', ARRAY['Ocean Views', 'Modern Kitchen', 'Hardwood Floors', 'Two-Car Garage', 'Private Patio', 'Walk to Beach', 'Updated Bathrooms', 'Central AC'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.8328, -117.2713, 12, 'SD1234567', 'https://example.com/virtual-tour'),

(2, 'Modern Downtown Condo with City Views', 650000, '1240 India Street #502', 'San Diego', 'CA', '92101', 2, 2.0, 1200, NULL, 2020, 'Condo', 'For Sale', 'Luxury high-rise condo in the heart of downtown San Diego. Features floor-to-ceiling windows, premium finishes, and stunning city views. Building amenities include rooftop pool, fitness center, and concierge service.', ARRAY['City Views', 'High-Rise Living', 'Rooftop Pool', 'Fitness Center', 'Concierge', 'In-Unit Laundry', 'Stainless Appliances', 'Balcony'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.7157, -117.1611, 8, 'SD2345678', NULL),

(3, 'Charming Craftsman in North Park', 720000, '3456 30th Street', 'San Diego', 'CA', '92104', 3, 2.0, 1650, '0.15 acres', 1925, 'Single Family', 'For Sale', 'Beautifully restored Craftsman home in trendy North Park. Original hardwood floors, built-in cabinetry, and period details throughout. Updated kitchen and bathrooms while maintaining historic charm.', ARRAY['Historic Charm', 'Hardwood Floors', 'Built-in Cabinetry', 'Updated Kitchen', 'Front Porch', 'Mature Trees', 'Walk to Restaurants', 'Original Details'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.7441, -117.1294, 25, 'SD3456789', NULL),

(4, 'Family Home in Scripps Ranch', 425000, '10234 Scripps Lake Drive', 'San Diego', 'CA', '92131', 4, 3.0, 2200, '0.3 acres', 1995, 'Single Family', 'For Sale', 'Spacious family home in desirable Scripps Ranch community. Features include vaulted ceilings, fireplace, and large backyard perfect for entertaining. Excellent schools and family-friendly neighborhood.', ARRAY['Vaulted Ceilings', 'Fireplace', 'Large Backyard', 'Two-Car Garage', 'Family Room', 'Excellent Schools', 'Quiet Street', 'Storage Space'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.9089, -117.1311, 18, 'SD4567890', NULL),

(5, 'Beachside Townhouse in Mission Beach', 590000, '742 Seagull Court', 'San Diego', 'CA', '92109', 2, 2.0, 1100, NULL, 2010, 'Townhouse', 'For Sale', 'Rare opportunity to own a townhouse just steps from Mission Beach! This modern unit features an open layout, private patio, and is perfect for beach lovers. Walk to restaurants, shops, and the famous Mission Beach boardwalk.', ARRAY['Steps to Beach', 'Private Patio', 'Open Layout', 'Modern Design', 'Walk to Boardwalk', 'Beach Community', 'Low Maintenance', 'Assigned Parking'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.7701, -117.2528, 6, 'SD5678901', NULL),

(6, 'Luxury Estate in Carmel Valley', 1450000, '12485 Carmel Country Road', 'San Diego', 'CA', '92130', 5, 4.0, 3200, '0.4 acres', 2015, 'Single Family', 'For Sale', 'Stunning luxury estate in exclusive Carmel Valley. Features include gourmet kitchen with premium appliances, wine cellar, home theater, and resort-style backyard with pool and spa. Top-rated schools nearby.', ARRAY['Gourmet Kitchen', 'Wine Cellar', 'Home Theater', 'Pool & Spa', '3-Car Garage', 'High Ceilings', 'Premium Finishes', 'Mountain Views'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.9342, -117.2197, 15, 'SD6789012', 'https://example.com/virtual-tour-carmel'),

(7, 'Hillcrest Victorian Restoration', 825000, '1876 Front Street', 'San Diego', 'CA', '92103', 4, 3.0, 2400, '0.18 acres', 1905, 'Single Family', 'For Sale', 'Meticulously restored Victorian home in the heart of Hillcrest. Original architectural details preserved while adding modern conveniences. Walking distance to Balboa Park, restaurants, and shopping.', ARRAY['Historic Architecture', 'Original Moldings', 'Bay Windows', 'Updated Systems', 'Walk to Balboa Park', 'Hardwood Floors', 'Period Details', 'Modern Kitchen'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.7457, -117.1661, 32, 'SD7890123', NULL),

(8, 'Pacific Beach Surf Retreat', 775000, '4521 Mission Boulevard', 'San Diego', 'CA', '92109', 3, 2.0, 1750, '0.12 acres', 2019, 'Single Family', 'For Sale', 'Modern beach house just two blocks from the ocean in vibrant Pacific Beach. Perfect for surf enthusiasts with outdoor shower, bike storage, and rooftop deck with ocean views. Walk to restaurants and nightlife.', ARRAY['Ocean Views', 'Rooftop Deck', 'Outdoor Shower', 'Bike Storage', 'Modern Design', 'Walk to Beach', 'Close to Nightlife', 'Parking Space'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.7941, -117.2533, 9, 'SD8901234', NULL),

(9, 'Chula Vista Family Paradise', 695000, '1205 Otay Lakes Road', 'Chula Vista', 'CA', '91913', 4, 3.0, 2650, '0.28 acres', 2008, 'Single Family', 'For Sale', 'Spacious family home in desirable Chula Vista neighborhood. Features include open floor plan, upgraded kitchen, master suite with walk-in closet, and large backyard perfect for kids and pets. Great schools and community amenities.', ARRAY['Open Floor Plan', 'Upgraded Kitchen', 'Master Suite', 'Large Backyard', 'Great Schools', 'Community Pool', 'Quiet Neighborhood', 'RV Parking'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.6401, -117.0842, 21, 'SD9012345', NULL),

(10, 'Del Mar Heights Contemporary', 1275000, '13755 Mira Mesa Boulevard', 'San Diego', 'CA', '92129', 4, 3.0, 2850, '0.22 acres', 2017, 'Single Family', 'For Sale', 'Contemporary home with stunning canyon and ocean views in prestigious Del Mar Heights. Features include chef''s kitchen, great room with fireplace, master retreat, and private outdoor entertaining space.', ARRAY['Canyon Views', 'Ocean Views', 'Chef''s Kitchen', 'Great Room', 'Master Retreat', 'Outdoor Kitchen', 'Solar Panels', 'Smart Home'], 'f74e41d5-520b-4b0c-b29e-13630b3fe8e6', 32.9147, -117.1413, 11, 'SD0123456', 'https://example.com/virtual-tour-delmar')
ON CONFLICT (id) DO NOTHING;

-- Insert property images
INSERT INTO public.property_images (property_id, url, display_order, is_primary) VALUES
-- Property 1
(1, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(1, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(1, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(1, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false),

-- Property 2
(2, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(2, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(2, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(2, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false),

-- Property 3
(3, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(3, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(3, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(3, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false),

-- Property 4
(4, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(4, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(4, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(4, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false),

-- Property 5
(5, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(5, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(5, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(5, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false),

-- Property 6
(6, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(6, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(6, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(6, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false),

-- Property 7
(7, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(7, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(7, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(7, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false),

-- Property 8
(8, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(8, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(8, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(8, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false),

-- Property 9
(9, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(9, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(9, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(9, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false),

-- Property 10
(10, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
(10, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, false),
(10, 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
(10, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Insert schools data (only for properties that have schools info)
INSERT INTO public.schools (property_id, elementary_school, middle_school, high_school) VALUES
(1, 'La Jolla Elementary', 'Muirlands Middle School', 'La Jolla High School'),
(4, 'Scripps Elementary', 'Marshall Middle School', 'Scripps Ranch High School'),
(6, 'Carmel Valley Elementary', 'Carmel Valley Middle School', 'Torrey Pines High School'),
(9, 'Otay Elementary', 'Rancho del Rey Middle School', 'Eastlake High School');

-- Reset the sequence for properties table
SELECT setval('public.properties_id_seq', (SELECT MAX(id) FROM public.properties)); 