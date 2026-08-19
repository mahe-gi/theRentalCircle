'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  FileText, 
  Home, 
  Layers, 
  Image as ImageIcon, 
  Lock, 
  PhoneCall, 
  AlertCircle,
  Eye,
  Star,
  Info
} from 'lucide-react';
import { getSessionUser } from '@/lib/session';
import { formatINR } from '@/lib/utils';

// Step Enumeration
type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

interface PhotoItem {
  id: string;
  url: string;
  roomTag: 'main_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'balcony_exterior' | 'other';
  caption: string;
  isCover: boolean;
}

const SAMPLE_PHOTO_PRESETS: PhotoItem[] = [
  {
    id: 'sample-1',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    roomTag: 'main_room',
    caption: 'Sunlit living and dining room with cross ventilation',
    isCover: true,
  },
  {
    id: 'sample-2',
    url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
    roomTag: 'bedroom',
    caption: 'Master bedroom with built-in wooden wardrobes',
    isCover: false,
  },
  {
    id: 'sample-3',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    roomTag: 'kitchen',
    caption: 'L-shaped modular kitchen with granite platform',
    isCover: false,
  },
  {
    id: 'sample-4',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    roomTag: 'bathroom',
    caption: 'Western toilet attached bathroom with geyser',
    isCover: false,
  },
];

const AVAILABLE_AMENITIES = [
  { id: '24/7 Water', label: '24/7 Water Supply', icon: '💧' },
  { id: 'Power Backup', label: '100% Power Backup', icon: '⚡' },
  { id: 'Lift', label: 'Passenger Lift', icon: '🛗' },
  { id: 'Covered Car Parking', label: 'Covered Car Parking', icon: '🚗' },
  { id: 'Two-Wheeler Parking', label: 'Two-Wheeler Parking', icon: '🛵' },
  { id: 'Geyser', label: 'Geyser / Water Heater', icon: '🚿' },
  { id: 'Air Conditioner', label: 'Air Conditioner (AC)', icon: '❄️' },
  { id: 'Modular Kitchen', label: 'Modular Kitchen', icon: '🍳' },
  { id: 'High-Speed Wi-Fi', label: 'High-Speed Wi-Fi Ready', icon: '📶' },
  { id: 'Security CCTV', label: '24/7 Security Guard & CCTV', icon: '🛡️' },
  { id: 'Balcony', label: 'Private Balcony', icon: '🌅' },
  { id: 'Washing Machine', label: 'Washing Machine Provision', icon: '🧺' },
  { id: 'Wardrobe', label: 'Fitted Bedroom Wardrobes', icon: '🚪' },
  { id: 'Gated Community', label: 'Gated Community / Clubhouse', icon: '🏢' },
];

export default function NewOwnerListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  // Step 1: Location & Basics
  const [cluster, setCluster] = useState<'gachibowli' | 'kondapur' | 'madhapur' | 'hitec_city' | 'manikonda' | 'financial_district'>('kondapur');
  const [colonyOrSociety, setColonyOrSociety] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('500084');
  const [propertyType, setPropertyType] = useState<'1rk' | '1bhk' | '2bhk' | '3plus_bhk' | 'shared_room' | 'private_room' | 'independent_house' | 'penthouse'>('2bhk');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Step 2: Financial Terms
  const [monthlyRent, setMonthlyRent] = useState<number>(25000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(50000);
  const [maintenanceCharges, setMaintenanceCharges] = useState<number>(2000);
  const [isMaintenanceIncluded, setIsMaintenanceIncluded] = useState<boolean>(false);
  const [lockInMonths, setLockInMonths] = useState<number>(6);
  const [noticeDays, setNoticeDays] = useState<number>(30);
  const [availableFrom, setAvailableFrom] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Step 3: Space Specs & House Guidelines
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState<number>(1100);
  const [floorNumber, setFloorNumber] = useState<number>(2);
  const [totalFloors, setTotalFloors] = useState<number>(5);
  const [furnishingStatus, setFurnishingStatus] = useState<'unfurnished' | 'semi_furnished' | 'fully_furnished'>('semi_furnished');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Water',
    'Power Backup',
    'Lift',
    'Covered Car Parking',
    'Geyser',
    'Wardrobe',
  ]);
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);
  const [houseGuidelines, setHouseGuidelines] = useState<string>('Quiet residential environment. Clean and timely rent maintenance expected.');

  // Step 4: Photos
  const [photos, setPhotos] = useState<PhotoItem[]>([...SAMPLE_PHOTO_PRESETS]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTag, setNewPhotoTag] = useState<PhotoItem['roomTag']>('main_room');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Step 5: Private Utility Evidence
  const [evidenceType, setEvidenceType] = useState<'tgspdcl_bill' | 'ghmc_tax_receipt' | 'society_noc' | 'other'>('tgspdcl_bill');
  const [consumerNumber, setConsumerNumber] = useState('1029384756');
  const [evidenceDocRef, setEvidenceDocRef] = useState('TSSPDCL_Electricity_Bill_July2026.pdf');

  // Step 6: Owner & Handshake Confirmation
  const [ownerName, setOwnerName] = useState('Suresh Reddy');
  const [ownerPhone, setOwnerPhone] = useState('+91 98490 12345');
  const [ownerEmail, setOwnerEmail] = useState('owner1@therentalcircle.in');
  const [founderCallAcknowledged, setFounderCallAcknowledged] = useState(true);
  const [zeroBrokerageDeclared, setZeroBrokerageDeclared] = useState(true);

  // Sync session user on mount
  useEffect(() => {
    const user = getSessionUser();
    if (user) {
      if (user.name) setOwnerName(user.name);
      if (user.email) setOwnerEmail(user.email);
      if (user.phone) setOwnerPhone(user.phone);
    }
  }, []);

  // Auto-generate title suggestion when locality or type changes if user hasn't typed custom
  useEffect(() => {
    const typeLabel = propertyType === '1rk' ? '1 RK Independent Unit'
      : propertyType === '1bhk' ? '1 BHK Apartment'
      : propertyType === '2bhk' ? '2 BHK Semi-Furnished'
      : propertyType === '3plus_bhk' ? '3 BHK Spacious Home'
      : propertyType === 'private_room' ? 'Private Room in Residential Building'
      : propertyType === 'shared_room' ? 'Dedicated Shared Bedspace'
      : propertyType === 'penthouse' ? 'Duplex Penthouse'
      : 'Independent Residential House';
    
    const clusterLabel = cluster === 'gachibowli' ? 'Gachibowli'
      : cluster === 'kondapur' ? 'Kondapur'
      : cluster === 'madhapur' ? 'Madhapur'
      : cluster === 'hitec_city' ? 'HITEC City'
      : cluster === 'manikonda' ? 'Manikonda'
      : 'Financial District';

    const col = colonyOrSociety.trim() ? ` near ${colonyOrSociety.trim()}` : ` in ${clusterLabel}`;
    setTitle(`${typeLabel}${col}`);
  }, [propertyType, cluster, colonyOrSociety]);

  // Toggle amenity
  const handleToggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId) ? prev.filter(a => a !== amenityId) : [...prev, amenityId]
    );
  };

  // Add custom photo
  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const newId = `photo-${Date.now()}`;
    const newPhoto: PhotoItem = {
      id: newId,
      url: newPhotoUrl.trim(),
      roomTag: newPhotoTag,
      caption: newPhotoCaption.trim() || `${newPhotoTag.replace('_', ' ')} view`,
      isCover: photos.length === 0,
    };
    setPhotos([...photos, newPhoto]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  // Remove photo
  const handleRemovePhoto = (id: string) => {
    const remaining = photos.filter(p => p.id !== id);
    if (remaining.length > 0 && !remaining.some(p => p.isCover)) {
      remaining[0].isCover = true;
    }
    setPhotos(remaining);
  };

  // Set Cover Photo
  const handleSetCoverPhoto = (id: string) => {
    setPhotos(photos.map(p => ({ ...p, isCover: p.id === id })));
  };

  // Quick preset photos
  const handleLoadSamplePhotos = () => {
    setPhotos([...SAMPLE_PHOTO_PRESETS]);
  };

  // Step navigation validations
  const validateStep = (step: WizardStep): boolean => {
    setSubmitError(null);
    if (step === 1) {
      if (!colonyOrSociety.trim()) {
        setSubmitError('Please enter the Colony, Society, or Building name.');
        return false;
      }
      if (!pincode.trim() || pincode.trim().length < 6) {
        setSubmitError('Please enter a valid 6-digit Pincode.');
        return false;
      }
      if (!title.trim()) {
        setSubmitError('Please provide a listing title.');
        return false;
      }
    }
    if (step === 2) {
      if (monthlyRent <= 0) {
        setSubmitError('Monthly rent must be a positive number.');
        return false;
      }
      if (securityDeposit < 0) {
        setSubmitError('Security deposit cannot be negative.');
        return false;
      }
      if (!availableFrom) {
        setSubmitError('Please select when the property will be available from.');
        return false;
      }
    }
    if (step === 3) {
      if (carpetAreaSqFt <= 0) {
        setSubmitError('Please enter a valid carpet area in sq.ft.');
        return false;
      }
    }
    if (step === 4) {
      if (photos.length === 0) {
        setSubmitError('Please add at least one room photograph.');
        return false;
      }
    }
    if (step === 5) {
      if (!consumerNumber.trim()) {
        setSubmitError('Please enter the TSSPDCL Consumer Service Connection Number (USCNO) or society reference number.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep((currentStep + 1) as WizardStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit Listing
  const handleSubmitListing = async () => {
    if (!founderCallAcknowledged) {
      setSubmitError('You must acknowledge the founder verification call requirement.');
      return;
    }
    if (!zeroBrokerageDeclared) {
      setSubmitError('You must agree to the Zero-Brokerage commitment declaration.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        title,
        description: description.trim() || `${propertyType.toUpperCase()} in ${colonyOrSociety}, ${cluster}. ${furnishingStatus.replace('_', ' ')} unit with ${carpetAreaSqFt} sq.ft carpet area. ${houseGuidelines}`,
        cluster,
        colonyOrSociety,
        landmark,
        pincode,
        propertyType,
        monthlyRent: Number(monthlyRent),
        securityDeposit: Number(securityDeposit),
        maintenanceCharges: isMaintenanceIncluded ? 0 : Number(maintenanceCharges),
        isMaintenanceIncluded,
        lockInMonths: Number(lockInMonths),
        noticeDays: Number(noticeDays),
        furnishingStatus,
        carpetAreaSqFt: Number(carpetAreaSqFt),
        floorNumber: Number(floorNumber),
        totalFloors: Number(totalFloors),
        availableFrom,
        petsAllowed,
        amenities: selectedAmenities,
        photos: photos.map(p => ({
          url: p.url,
          roomTag: p.roomTag,
          isCover: p.isCover,
          caption: p.caption,
        })),
        evidence: {
          type: evidenceType,
          urlOrDoc: evidenceDocRef || 'evidence/auto-submitted-document.pdf',
          consumerNumber,
        },
        ownerName,
        ownerPhone,
        ownerEmail,
      };

      const res = await fetch('/api/owner/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to create listing');
      }

      // Redirect to owner dashboard
      router.push('/owner/listings?created=true');
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong while submitting your property.');
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Location & Type' },
    { num: 2, label: 'Rent & Lease' },
    { num: 3, label: 'Specs & Amenities' },
    { num: 4, label: 'Room Photos' },
    { num: 5, label: 'Utility Evidence' },
    { num: 6, label: 'Review & Submit' },
  ];

  return (
    <RouteGuard allowedRoles={["owner","admin"]} title="Property Submission Wizard" description="This wizard is reserved for property owners to list verified residential properties.">
      <div className="min-h-screen bg-canvas text-midnight font-sans antialiased selection:bg-cobalt selection:text-white pb-24">
      {/* Top Banner & Header */}
      <div className="border-b border-border bg-white sticky top-16 z-30 shadow-xs">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-text-muted uppercase tracking-wider">
              <Link href="/owner/listings" className="hover:text-midnight flex items-center gap-1 font-bold">
                <ArrowLeft className="h-3.5 w-3.5" /> Owner Dashboard
              </Link>
              <span>/</span>
              <span className="text-cobalt font-black">Listing Wizard</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-[2px] bg-surface-muted border border-border px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-midnight">
                <ShieldCheck className="h-3.5 w-3.5 text-verified" /> ZERO BROKERAGE VERIFIED
              </span>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-black text-midnight uppercase tracking-wider">
                Step {currentStep} of 6: {stepsList[currentStep - 1].label}
              </span>
              <span className="text-xs font-mono text-text-muted">
                {Math.round((currentStep / 6) * 100)}% Completed
              </span>
            </div>

            <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden border border-border/50">
              <div 
                className="h-full bg-cobalt transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>

            {/* Horizontal Step Pills */}
            <div className="hidden sm:grid grid-cols-6 gap-2 mt-3 text-center">
              {stepsList.map(s => {
                const isDone = s.num < currentStep;
                const isCurrent = s.num === currentStep;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (s.num < currentStep) setCurrentStep(s.num as WizardStep);
                    }}
                    disabled={s.num > currentStep}
                    className={`py-1.5 px-1 rounded-[2px] text-[10px] font-mono uppercase tracking-wider transition-all border ${
                      isCurrent
                        ? 'bg-midnight text-white border-midnight font-bold shadow-xs'
                        : isDone
                        ? 'bg-white text-verified border-verified-border font-bold hover:bg-verified-surface'
                        : 'bg-surface-subtle text-text-faint border-border/50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isDone && <Check className="h-2.5 w-2.5" />}
                      <span>{s.num}. {s.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        {submitError && (
          <div className="mb-6 p-4 rounded-[2px] bg-tangerine-surface border border-tangerine-border text-tangerine-dark text-xs font-medium flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Please check your details:</p>
              <p>{submitError}</p>
            </div>
          </div>
        )}

        {/* STEP 1: LOCATION & PROPERTY BASICS */}
        {currentStep === 1 && (
          <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-6 shadow-sm text-left">
            <div className="border-b border-border pb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cobalt">
                Step 1 &bull; Location & Core Specifications
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-midnight tracking-tight mt-1">
                Where is your property located?
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                We focus on key residential tech corridors in West Hyderabad to connect verified owners with high-intent renters.
              </p>
            </div>

            {/* Corridor / Cluster Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Tech Corridor / Cluster <span className="text-tangerine">*</span>
              </label>
              <select
                value={cluster}
                onChange={e => setCluster(e.target.value as any)}
                className="w-full rounded-[2px] border border-border bg-white p-3 text-xs font-bold text-midnight font-mono uppercase focus:border-cobalt focus:outline-none shadow-xs"
              >
                <option value="kondapur">Kondapur (Botanical Garden, Chirec, Silpa Park)</option>
                <option value="madhapur">Madhapur (Ayyappa Society, 100ft Rd, Mega Hills)</option>
                <option value="gachibowli">Gachibowli (Telecom Nagar, DLF Corridor, Stadium)</option>
                <option value="hitec_city">HITEC City (Cyber Towers, Cyber Gateway, Mindspace)</option>
                <option value="manikonda">Manikonda (OU Colony, Puppalguda Border)</option>
                <option value="financial_district">Financial District (Narsingi, Kokapet, ISB Rd)</option>
              </select>
            </div>

            {/* Colony or Society */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Colony / Society / Gated Community <span className="text-tangerine">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Silpa Park Colony, Ayyappa Society, My Home Avatar"
                value={colonyOrSociety}
                onChange={e => setColonyOrSociety(e.target.value)}
                className="w-full rounded-[2px] border border-border bg-white p-3 text-xs font-medium text-midnight focus:border-cobalt focus:outline-none shadow-xs"
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-text-muted">Quick suggestions:</span>
                {['Silpa Park Colony', 'Ayyappa Society', 'Telecom Nagar', 'OU Colony', 'Sri Ramnagar'].map(suggest => (
                  <button
                    key={suggest}
                    type="button"
                    onClick={() => setColonyOrSociety(suggest)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-surface-muted border border-border hover:border-midnight text-text-secondary"
                  >
                    + {suggest}
                  </button>
                ))}
              </div>
            </div>

            {/* Landmark & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opp. Botanical Garden Gate 2"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  className="w-full rounded-[2px] border border-border bg-white p-3 text-xs font-medium text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Pincode <span className="text-tangerine">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 500084"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  className="w-full rounded-[2px] border border-border bg-white p-3 text-xs font-mono font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Property Type Grid */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Property Configuration <span className="text-tangerine">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: '1rk', label: '1 RK', desc: 'Single unit + bath' },
                  { id: '1bhk', label: '1 BHK', desc: '1 Bed, Hall, Kitchen' },
                  { id: '2bhk', label: '2 BHK', desc: '2 Bed, Hall, Kitchen' },
                  { id: '3plus_bhk', label: '3+ BHK', desc: '3+ Bedrooms' },
                  { id: 'private_room', label: 'Private Room', desc: 'Ensuite bath in apt' },
                  { id: 'shared_room', label: 'Shared Room', desc: 'Bedspace in colive' },
                  { id: 'independent_house', label: 'Ind. House', desc: 'Standalone villa' },
                  { id: 'penthouse', label: 'Penthouse', desc: 'Top floor / terrace' },
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPropertyType(type.id as any)}
                    className={`p-3 rounded-[2px] border text-left transition-all ${
                      propertyType === type.id
                        ? 'border-cobalt bg-cobalt/5 ring-1 ring-cobalt'
                        : 'border-border bg-white hover:border-midnight'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-midnight uppercase">{type.label}</div>
                    <div className="text-[10px] text-text-muted mt-0.5">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Title & Description */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Public Listing Title <span className="text-tangerine">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-[2px] border border-border bg-white p-3 text-xs font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
              />
              <p className="text-[10px] font-mono text-text-muted">
                Keep title descriptive and accurate. Example: "2 BHK Semi-Furnished near Ayyappa Society".
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Property Overview & Natural Light / Ventilation Details
              </label>
              <textarea
                rows={3}
                placeholder="Highlight floor plan, ventilation, balcony orientation, quiet surroundings, or proximity to office campuses..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full rounded-[2px] border border-border bg-white p-3 text-xs text-midnight focus:border-cobalt focus:outline-none shadow-xs leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 2: FINANCIAL TERMS & LEASE PERIOD */}
        {currentStep === 2 && (
          <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-6 shadow-sm text-left">
            <div className="border-b border-border pb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cobalt">
                Step 2 &bull; Financial Terms & Transparency
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-midnight tracking-tight mt-1">
                Define transparent rent and deposit conditions
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Zero hidden charges. Itemize maintenance and define clear lock-in periods upfront to build trust.
              </p>
            </div>

            {/* Rent & Deposit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Monthly Rent (₹/month) <span className="text-tangerine">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-text-muted">₹</span>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={monthlyRent}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setMonthlyRent(val);
                      setSecurityDeposit(val * 2);
                    }}
                    className="w-full rounded-[2px] border border-border bg-white pl-8 pr-4 py-3 text-sm font-mono font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                  />
                </div>
                <p className="text-[10px] font-mono text-text-muted">{formatINR(monthlyRent)} per month</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Security Deposit (₹) <span className="text-tangerine">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-text-muted">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={securityDeposit}
                    onChange={e => setSecurityDeposit(Number(e.target.value))}
                    className="w-full rounded-[2px] border border-border bg-white pl-8 pr-4 py-3 text-sm font-mono font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono text-text-muted">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setSecurityDeposit(monthlyRent * 2)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-surface-muted border border-border hover:border-midnight text-midnight font-bold"
                  >
                    2x Rent ({formatINR(monthlyRent * 2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecurityDeposit(monthlyRent * 3)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-surface-muted border border-border hover:border-midnight text-midnight font-bold"
                  >
                    3x Rent ({formatINR(monthlyRent * 3)})
                  </button>
                </div>
              </div>
            </div>

            {/* Maintenance Breakdown */}
            <div className="space-y-3 p-4 rounded-[2px] border border-border bg-surface-subtle">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Maintenance Charges
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMaintenanceIncluded}
                    onChange={e => setIsMaintenanceIncluded(e.target.checked)}
                    className="h-4 w-4 rounded-[2px] text-cobalt focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-midnight">Included in Monthly Rent</span>
                </label>
              </div>

              {!isMaintenanceIncluded && (
                <div className="space-y-1 pt-1">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-text-muted">₹</span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={maintenanceCharges}
                      onChange={e => setMaintenanceCharges(Number(e.target.value))}
                      className="w-full rounded-[2px] border border-border bg-white pl-8 pr-4 py-2.5 text-xs font-mono font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                      placeholder="e.g. 2000"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-text-muted">
                    Total monthly payout for renter: <strong>{formatINR(monthlyRent + maintenanceCharges)}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Lock-in Period & Notice Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Lock-in Period (Months)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 6, 11].map(months => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setLockInMonths(months)}
                      className={`py-2 px-1 rounded-[2px] border text-xs font-mono font-bold uppercase ${
                        lockInMonths === months
                          ? 'bg-midnight text-white border-midnight shadow-xs'
                          : 'bg-white text-midnight border-border hover:border-midnight'
                      }`}
                    >
                      {months} mo
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Notice Period (Days)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setNoticeDays(days)}
                      className={`py-2 px-1 rounded-[2px] border text-xs font-mono font-bold uppercase ${
                        noticeDays === days
                          ? 'bg-midnight text-white border-midnight shadow-xs'
                          : 'bg-white text-midnight border-border hover:border-midnight'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Available From Date */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Available From Date <span className="text-tangerine">*</span>
              </label>
              <input
                type="date"
                value={availableFrom}
                onChange={e => setAvailableFrom(e.target.value)}
                className="w-full sm:w-1/2 rounded-[2px] border border-border bg-white p-3 text-xs font-mono font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 3: SPACE SPECIFICATIONS & HOUSE GUIDELINES */}
        {currentStep === 3 && (
          <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-6 shadow-sm text-left">
            <div className="border-b border-border pb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cobalt">
                Step 3 &bull; Space Specs, Furnishing & Amenities
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-midnight tracking-tight mt-1">
                Property dimensions and amenities
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Accurate floor area and amenity declarations reduce unnecessary inquiries and save time.
              </p>
            </div>

            {/* Carpet Area, Floor & Total Floors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Carpet Area (sq.ft) <span className="text-tangerine">*</span>
                </label>
                <input
                  type="number"
                  min={50}
                  step={50}
                  value={carpetAreaSqFt}
                  onChange={e => setCarpetAreaSqFt(Number(e.target.value))}
                  className="w-full rounded-[2px] border border-border bg-white p-3 text-xs font-mono font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Floor Number
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={floorNumber}
                  onChange={e => setFloorNumber(Number(e.target.value))}
                  className="w-full rounded-[2px] border border-border bg-white p-3 text-xs font-mono font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Total Floors in Building
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={totalFloors}
                  onChange={e => setTotalFloors(Number(e.target.value))}
                  className="w-full rounded-[2px] border border-border bg-white p-3 text-xs font-mono font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Furnishing Status */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Furnishing Status <span className="text-tangerine">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'unfurnished', label: 'Unfurnished', desc: 'Basic lights & fans only' },
                  { id: 'semi_furnished', label: 'Semi-Furnished', desc: 'Wardrobes, modular kitchen, geysers' },
                  { id: 'fully_furnished', label: 'Fully Furnished', desc: 'Beds, AC, sofa, appliances ready' },
                ].map(furn => (
                  <button
                    key={furn.id}
                    type="button"
                    onClick={() => setFurnishingStatus(furn.id as any)}
                    className={`p-3.5 rounded-[2px] border text-left transition-all ${
                      furnishingStatus === furn.id
                        ? 'border-cobalt bg-cobalt/5 ring-1 ring-cobalt'
                        : 'border-border bg-white hover:border-midnight'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-midnight uppercase">{furn.label}</div>
                    <div className="text-[10px] text-text-muted mt-0.5">{furn.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Available Amenities ({selectedAmenities.length} selected)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AVAILABLE_AMENITIES.map(item => {
                  const isChecked = selectedAmenities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleAmenity(item.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-[2px] border text-left transition-all ${
                        isChecked
                          ? 'border-midnight bg-surface-muted text-midnight font-bold'
                          : 'border-border bg-white text-text-secondary hover:border-midnight/50'
                      }`}
                    >
                      <span className="text-sm shrink-0">{item.icon}</span>
                      <span className="text-xs truncate">{item.label}</span>
                      {isChecked && <Check className="h-3 w-3 ml-auto text-cobalt shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* House Guidelines & Pet Policy */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-[2px] border border-border bg-surface-subtle">
                <div>
                  <div className="text-xs font-bold text-midnight">Pet Policy</div>
                  <div className="text-[11px] text-text-muted">Are household pets (cats/dogs) allowed on the property?</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPetsAllowed(true)}
                    className={`px-3 py-1.5 rounded-[2px] text-xs font-mono font-bold uppercase ${
                      petsAllowed ? 'bg-verified text-white' : 'bg-white border border-border text-midnight'
                    }`}
                  >
                    Pets Allowed
                  </button>
                  <button
                    type="button"
                    onClick={() => setPetsAllowed(false)}
                    className={`px-3 py-1.5 rounded-[2px] text-xs font-mono font-bold uppercase ${
                      !petsAllowed ? 'bg-midnight text-white' : 'bg-white border border-border text-midnight'
                    }`}
                  >
                    No Pets
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  House Guidelines & Community Preferences
                </label>
                <input
                  type="text"
                  value={houseGuidelines}
                  onChange={e => setHouseGuidelines(e.target.value)}
                  placeholder="e.g. Respect quiet hours after 10 PM. Clean common areas."
                  className="w-full rounded-[2px] border border-border bg-white p-3 text-xs text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ROOM-BY-ROOM PHOTO MANAGEMENT */}
        {currentStep === 4 && (
          <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-6 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cobalt">
                  Step 4 &bull; Room-by-Room Photo Gallery
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-midnight tracking-tight mt-1">
                  Upload & tag authentic room photographs
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Every photo must have a specific room tag. No agency watermarks or generic stock photos allowed.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadSamplePhotos}
                className="inline-flex items-center gap-1.5 rounded-[2px] border border-cobalt bg-cobalt/5 px-3 py-1.5 text-xs font-mono font-bold text-cobalt hover:bg-cobalt hover:text-white transition-all shrink-0 self-start sm:self-auto"
              >
                <Sparkles className="h-3.5 w-3.5" /> Load Sample Pack
              </button>
            </div>

            {/* Photo List Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                  Added Photos ({photos.length})
                </span>
                <span className="text-[11px] font-mono text-text-muted">
                  Click 'Set as Cover' to choose the main listing cover
                </span>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {photos.map(photo => (
                    <div
                      key={photo.id}
                      className={`relative rounded-[2px] border overflow-hidden bg-surface-muted transition-all ${
                        photo.isCover
                          ? 'border-cobalt ring-2 ring-cobalt'
                          : 'border-border hover:border-midnight/60'
                      }`}
                    >
                      <div className="aspect-[16/10] relative bg-midnight/5 overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="h-full w-full object-cover"
                        />
                        {photo.isCover && (
                          <span className="absolute top-2 left-2 bg-cobalt text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-[2px] shadow-sm flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 fill-current" /> Cover Photo
                          </span>
                        )}
                        <span className="absolute top-2 right-2 bg-midnight/85 backdrop-blur-xs text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-[2px]">
                          {photo.roomTag.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="p-3 bg-white space-y-2">
                        <p className="text-xs font-medium text-midnight line-clamp-1">
                          {photo.caption || 'No caption entered'}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-border/60">
                          {!photo.isCover ? (
                            <button
                              type="button"
                              onClick={() => handleSetCoverPhoto(photo.id)}
                              className="text-[10px] font-mono font-bold uppercase text-cobalt hover:underline"
                            >
                              Set as Cover
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-text-muted">Primary Display</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="text-[10px] font-mono font-bold uppercase text-tangerine hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-border rounded-[2px] space-y-2">
                  <ImageIcon className="h-8 w-8 mx-auto text-text-faint" />
                  <p className="text-xs font-bold text-midnight">No room photos added yet</p>
                  <p className="text-[11px] text-text-muted">Use the form below or click 'Load Sample Pack' above to add photos.</p>
                </div>
              )}
            </div>

            {/* Add Photo Form Box */}
            <div className="p-4 sm:p-5 rounded-[2px] border border-border bg-surface-subtle space-y-3.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-midnight flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-cobalt" /> Add New Room Photo
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                    Photo Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newPhotoUrl}
                    onChange={e => setNewPhotoUrl(e.target.value)}
                    className="w-full rounded-[2px] border border-border bg-white p-2.5 text-xs text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                    Room Tag
                  </label>
                  <select
                    value={newPhotoTag}
                    onChange={e => setNewPhotoTag(e.target.value as any)}
                    className="w-full rounded-[2px] border border-border bg-white p-2.5 text-xs font-mono font-bold text-midnight uppercase focus:border-cobalt focus:outline-none shadow-xs"
                  >
                    <option value="main_room">Living Space / Hall</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="balcony_exterior">Balcony / Corridor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                <div className="grow space-y-1">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                    Caption / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Master bedroom with natural sunlight"
                    value={newPhotoCaption}
                    onChange={e => setNewPhotoCaption(e.target.value)}
                    className="w-full rounded-[2px] border border-border bg-white p-2.5 text-xs text-midnight focus:border-cobalt focus:outline-none shadow-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddPhoto}
                  disabled={!newPhotoUrl.trim()}
                  className="rounded-[2px] bg-midnight px-4 py-2.5 text-xs font-mono font-bold uppercase text-white hover:bg-cobalt transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  Add Room Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PRIVATE UTILITY CONNECTION EVIDENCE */}
        {currentStep === 5 && (
          <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-6 shadow-sm text-left">
            <div className="border-b border-border pb-4">
              <div className="inline-flex items-center gap-1.5 rounded-[2px] bg-cobalt/10 border border-cobalt/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-cobalt mb-2">
                <Lock className="h-3 w-3" /> Strictly Confidential Evidence
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-midnight tracking-tight">
                Private utility connection verification
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                To guarantee zero brokers on The Rental Circle, our moderation team inspects an official TSSPDCL/TGSPDCL domestic power record or society NOC.
              </p>
            </div>

            {/* Privacy Shield Notice */}
            <div className="p-4 rounded-[2px] border border-verified-border bg-verified-surface text-verified flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed space-y-1">
                <p className="font-bold text-verified">Confidentiality Guarantee</p>
                <p className="text-text-secondary">
                  Your utility bill, meter number, and consumer identifier are <strong>never shown to prospective renters</strong> or indexed publicly. They are stored in an encrypted quarantine bucket solely for human moderator verification.
                </p>
              </div>
            </div>

            {/* Evidence Provider Type */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Evidence Document Type <span className="text-tangerine">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'tgspdcl_bill', label: 'TSSPDCL Electricity Bill', desc: 'Unique Service Number (USCNO)' },
                  { id: 'ghmc_tax_receipt', label: 'GHMC Property Tax', desc: 'PTIN Assessment record' },
                  { id: 'society_noc', label: 'Society NOC / Maintenance', desc: 'Gated community receipt' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEvidenceType(item.id as any)}
                    className={`p-3.5 rounded-[2px] border text-left transition-all ${
                      evidenceType === item.id
                        ? 'border-cobalt bg-cobalt/5 ring-1 ring-cobalt font-bold'
                        : 'border-border bg-white hover:border-midnight'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-midnight uppercase">{item.label}</div>
                    <div className="text-[10px] text-text-muted mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Consumer Number Input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                TSSPDCL Unique Service Connection No. (USCNO) / PTIN <span className="text-tangerine">*</span>
              </label>
              <input
                type="text"
                value={consumerNumber}
                onChange={e => setConsumerNumber(e.target.value)}
                placeholder="e.g. 1029384756 (from your Southern Power electricity bill)"
                className="w-full rounded-[2px] border border-border bg-white p-3 text-xs font-mono font-bold text-midnight focus:border-cobalt focus:outline-none shadow-xs"
              />
              <p className="text-[10px] font-mono text-text-muted">
                Locate your 10-digit USCNO on the top right of your TSSPDCL domestic bill.
              </p>
            </div>

            {/* Document Reference / File Note */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-midnight">
                Document Reference Name or File Attachment Reference
              </label>
              <input
                type="text"
                value={evidenceDocRef}
                onChange={e => setEvidenceDocRef(e.target.value)}
                placeholder="e.g. TSSPDCL_July2026_Flat204.pdf"
                className="w-full rounded-[2px] border border-border bg-white p-3 text-xs text-midnight focus:border-cobalt focus:outline-none shadow-xs font-mono"
              />
            </div>
          </div>
        )}

        {/* STEP 6: SUMMARY REVIEW & FOUNDER PHONE CONFIRMATION */}
        {currentStep === 6 && (
          <div className="space-y-6 text-left">
            {/* Main Review Card */}
            <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-border pb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cobalt">
                  Step 6 &bull; Final Summary Review
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-midnight tracking-tight mt-1">
                  Review your listing before submission
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Your listing will be submitted with <span className="font-bold text-midnight font-mono">[PENDING_REVIEW]</span> status and published once the phone confirmation handshake is complete.
                </p>
              </div>

              {/* Property Headline Summary */}
              <div className="p-4 rounded-[2px] border border-border bg-surface-subtle space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                  <div>
                    <span className="rounded-[2px] bg-cobalt px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                      {propertyType.replace('_', ' ')}
                    </span>
                    <h3 className="text-base font-black text-midnight mt-1">{title}</h3>
                    <p className="text-xs text-text-secondary font-mono flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-cobalt" /> {colonyOrSociety}, {cluster.toUpperCase()} ({pincode})
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xl font-black font-mono text-midnight">
                      {formatINR(monthlyRent)}
                      <span className="text-xs font-normal text-text-muted">/mo</span>
                    </div>
                    <div className="text-[10px] font-mono text-text-muted">
                      Deposit: {formatINR(securityDeposit)} &bull; {isMaintenanceIncluded ? 'Maint Incl.' : `+${formatINR(maintenanceCharges)} maint`}
                    </div>
                  </div>
                </div>

                {/* Specs Pill Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-[2px] bg-white border border-border/80">
                    <span className="text-[9px] text-text-muted uppercase block">Carpet Area</span>
                    <strong className="text-midnight">{carpetAreaSqFt} sq.ft</strong>
                  </div>
                  <div className="p-2 rounded-[2px] bg-white border border-border/80">
                    <span className="text-[9px] text-text-muted uppercase block">Floor</span>
                    <strong className="text-midnight">{floorNumber} of {totalFloors}</strong>
                  </div>
                  <div className="p-2 rounded-[2px] bg-white border border-border/80">
                    <span className="text-[9px] text-text-muted uppercase block">Furnishing</span>
                    <strong className="text-midnight capitalize">{furnishingStatus.replace('_', ' ')}</strong>
                  </div>
                  <div className="p-2 rounded-[2px] bg-white border border-border/80">
                    <span className="text-[9px] text-text-muted uppercase block">Available</span>
                    <strong className="text-midnight">{availableFrom}</strong>
                  </div>
                </div>

                {/* Amenities List */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Selected Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAmenities.map(am => (
                      <span key={am} className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-white border border-border text-midnight">
                        &bull; {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Photos Thumbnail Reel */}
                <div className="space-y-1.5 pt-2 border-t border-border/70">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">
                    Photo Reel ({photos.length} photos):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map(p => (
                      <div key={p.id} className="h-16 w-20 shrink-0 rounded-[2px] overflow-hidden border border-border relative">
                        <img src={p.url} alt={p.caption} className="h-full w-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-midnight/80 text-white text-[7px] font-mono font-bold uppercase px-1 truncate text-center">
                          {p.roomTag.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Utility Verification Evidence Pill */}
                <div className="p-2.5 rounded-[2px] bg-white border border-border flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-cobalt" />
                    <span>Evidence USCNO: <strong>{consumerNumber}</strong></span>
                  </div>
                  <span className="text-[10px] text-verified font-bold uppercase">Private Evidence Attached</span>
                </div>
              </div>

              {/* Owner Contact Information Check */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-midnight block">
                  Owner Contact Information (Private until application accepted)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-text-muted uppercase block">Owner Name</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      className="w-full rounded-[2px] border border-border bg-white p-2.5 text-xs font-bold text-midnight"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-text-muted uppercase block">Phone Number</label>
                    <input
                      type="text"
                      value={ownerPhone}
                      onChange={e => setOwnerPhone(e.target.value)}
                      className="w-full rounded-[2px] border border-border bg-white p-2.5 text-xs font-mono font-bold text-midnight"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-text-muted uppercase block">Email Address</label>
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={e => setOwnerEmail(e.target.value)}
                      className="w-full rounded-[2px] border border-border bg-white p-2.5 text-xs font-mono font-bold text-midnight"
                    />
                  </div>
                </div>
              </div>

              {/* Mandatory Declarations & Checkboxes */}
              <div className="space-y-3 pt-4 border-t border-border">
                <label className="flex items-start gap-3 p-3 rounded-[2px] border border-border bg-surface-subtle cursor-pointer hover:border-midnight/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={founderCallAcknowledged}
                    onChange={e => setFounderCallAcknowledged(e.target.checked)}
                    className="h-4 w-4 rounded-[2px] text-cobalt focus:ring-0 mt-0.5"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-midnight">Founder Phone Verification Acknowledgment</p>
                    <p className="text-text-secondary leading-relaxed">
                      I acknowledge that a Rental Circle founder/moderator will initiate a brief verification phone call to <strong>{ownerPhone}</strong> to confirm terms and availability before publishing this listing.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-[2px] border border-border bg-surface-subtle cursor-pointer hover:border-midnight/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={zeroBrokerageDeclared}
                    onChange={e => setZeroBrokerageDeclared(e.target.checked)}
                    className="h-4 w-4 rounded-[2px] text-cobalt focus:ring-0 mt-0.5"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-midnight">Zero-Brokerage Mandate Declaration</p>
                    <p className="text-text-secondary leading-relaxed">
                      I declare that I am the direct property owner or authorized representative, and no brokerage commission will ever be charged to prospective renters.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-[2px] border border-border bg-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-midnight hover:border-midnight hover:bg-surface-subtle transition-all active:scale-98 shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Step {currentStep - 1}
            </button>
          ) : (
            <Link
              href="/owner/listings"
              className="inline-flex items-center gap-2 rounded-[2px] border border-border bg-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-text-muted hover:text-midnight transition-colors"
            >
              Cancel
            </Link>
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-[2px] bg-midnight px-7 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-cobalt transition-all active:scale-98 shadow-sm"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitListing}
              disabled={isSubmitting || !founderCallAcknowledged || !zeroBrokerageDeclared}
              className="inline-flex items-center gap-2 rounded-[2px] bg-cobalt px-8 py-3.5 text-xs font-mono font-black uppercase tracking-wider text-white hover:bg-cobalt-hover transition-all active:scale-98 shadow-[0_2px_10px_rgba(37,71,245,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting to Queue...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-citrus" />
                  <span>Submit for Moderation Review</span>
                </>
              )}
            </button>
          )}
        </div>
      </main>
      </div>
    </RouteGuard>
  );
}