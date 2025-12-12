-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Create storage policies for the uploads bucket
CREATE POLICY "Anyone can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can update own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads');

-- Insert sample products with images
INSERT INTO products (name, description, short_description, category, technologies, is_published, is_featured, image_url) VALUES
('AgriSense AI', 'An AI-powered precision agriculture platform that uses satellite imagery and IoT sensors to monitor crop health, predict yields, and optimize irrigation. Farmers can make data-driven decisions to increase productivity while reducing resource usage.', 'Smart farming with AI crop monitoring', 'ai', ARRAY['Python', 'TensorFlow', 'IoT', 'AWS'], true, true, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'),
('BioTrack Pro', 'A comprehensive biotechnology research management system that streamlines lab workflows, tracks experiments, and manages biological sample inventories. Features AI-assisted data analysis for faster research outcomes.', 'Biotech lab management platform', 'ai', ARRAY['React', 'Node.js', 'PostgreSQL', 'ML'], true, true, 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800'),
('FinPulse Analytics', 'Real-time financial analytics platform powered by machine learning. Provides predictive market analysis, risk assessment, and automated trading signals for informed investment decisions.', 'AI-driven financial insights', 'ai', ARRAY['Python', 'React', 'TensorFlow', 'AWS'], true, true, 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800'),
('SmartCampus IoT', 'An integrated IoT solution for educational institutions featuring smart attendance, energy management, classroom automation, and campus security monitoring.', 'IoT-based campus automation', 'iot', ARRAY['Arduino', 'MQTT', 'Node.js', 'MongoDB'], true, false, 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'),
('EduFlow LMS', 'A modern learning management system designed for colleges and universities. Features AI-powered personalized learning paths, virtual classrooms, and comprehensive analytics for educators.', 'Next-gen college LMS platform', 'ai', ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'OpenAI'], true, true, 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800'),
('MediCare AI', 'An AI-assisted medical diagnosis support system that helps healthcare professionals with preliminary assessments, medical imaging analysis, and patient record management.', 'AI-powered healthcare assistant', 'ai', ARRAY['Python', 'TensorFlow', 'React', 'HIPAA'], true, true, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'),
('FoodChain360', 'End-to-end food supply chain management platform with blockchain-based traceability, quality monitoring, and inventory optimization for restaurants and food distributors.', 'Smart food supply chain solution', 'iot', ARRAY['React', 'Blockchain', 'IoT', 'Node.js'], true, false, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800');