import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faUsers, 
  faUserCircle, 
  faUserTie 
} from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../../assets/images/_56e07e0e-4f57-4d1d-b6a8-39eee4dcb08b.jpg';
import '../../styles/Testimonials.css';

const Testimonials = (): React.ReactElement => {
  const contentSectionRef = useRef<HTMLElement | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Function to check if elements are in viewport to apply fade effect
  const checkFade = () => {
    if (contentSectionRef.current) {
      const elementTop = contentSectionRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        contentSectionRef.current.classList.add('active');
      }
    }
  };

  // Set up fade effect on scroll
  useEffect(() => {
    // Initial check
    checkFade();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkFade);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', checkFade);
    };
  }, []);

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Check if testimonial should be visible based on current filter
  const isTestimonialVisible = (categories: string) => {
    if (activeFilter === 'all') return true;
    return categories.includes(activeFilter);
  };

  return (
    <>
      <div className="page-header" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="page-header-overlay"></div>
        <div className="page-header-content">
          <h1 className="text-center" style={{ margin: '0 auto', display: 'block', textAlign: 'center', width: '100%' }}>Member Testimonials</h1>
          <p className="text-center" style={{ margin: '0 auto', display: 'block', textAlign: 'center', width: '100%' }}>Authentic experiences from our community</p>
        </div>
      </div>

      <section className="container fade-in" ref={contentSectionRef}>

        
        <div className="filter-buttons">
          <button 
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('all')}
          >
            All Testimonials
          </button>
          <button 
            className={`filter-button ${activeFilter === 'first-time' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('first-time')}
          >
            First-Time Experiences
          </button>
          <button 
            className={`filter-button ${activeFilter === 'couples' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('couples')}
          >
            Couples & Partners
          </button>
          <button 
            className={`filter-button ${activeFilter === 'solo' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('solo')}
          >
            Solo Attendees
          </button>
          <button 
            className={`filter-button ${activeFilter === 'growth' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('growth')}
          >
            Personal Growth
          </button>
        </div>
        
        <div className="testimonials-container">
          <div 
            className={`testimonial-card ${!isTestimonialVisible('first-time solo growth') ? 'hidden' : ''}`} 
            data-categories="first-time solo growth"
          >
            <div className="testimonial-quote">"</div>
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="testimonial-info">
                <h3>Anonymous Member</h3>
                <p>Solo Attendee | 2 Years in Community</p>
              </div>
            </div>
            <div className="testimonial-content">
              <p>My first BodySharing event was transformative. I came with anxiety about being solo in such an intimate environment, but the structured welcome and clear consent guidelines made me feel safe immediately. The thoughtful introduction exercises helped me connect authentically with others before any physical intimacy was introduced.</p>
              <p>What I value most about this community is how it's taught me to communicate my boundaries clearly in all aspects of life. I've learned to express my needs without shame and to respect others' limits with genuine care. These skills have improved my everyday relationships tremendously.</p>
            </div>
            <div className="testimonial-tags">
              <span className="testimonial-tag">First-Time Experience</span>
              <span className="testimonial-tag">Solo Attendee</span>
              <span className="testimonial-tag">Personal Growth</span>
            </div>
          </div>
          
          <div 
            className={`testimonial-card ${!isTestimonialVisible('couples') ? 'hidden' : ''}`} 
            data-categories="couples"
          >
            <div className="testimonial-quote">"</div>
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="testimonial-info">
                <h3>Couple in Berlin</h3>
                <p>Partners | 3 Years in Community</p>
              </div>
            </div>
            <div className="testimonial-content">
              <p>As a couple who had been together for 7 years, we were looking for a way to explore new dimensions of intimacy together. BodySharing provided exactly what we needed—a structured, safe environment where we could expand our boundaries while maintaining our connection.</p>
              <p>The community's emphasis on checking in and ongoing consent has actually strengthened our relationship. We've adopted many of the communication practices we learned at events into our daily lives. The ability to explore individually while maintaining our partnership has been incredibly freeing.</p>
              <p>We particularly appreciate how the consent ambassadors help navigate complex situations with sensitivity and care.</p>
            </div>
            <div className="testimonial-tags">
              <span className="testimonial-tag">Couples</span>
              <span className="testimonial-tag">Relationship Growth</span>
            </div>
          </div>
          
          <div 
            className={`testimonial-card ${!isTestimonialVisible('first-time') ? 'hidden' : ''}`} 
            data-categories="first-time"
          >
            <div className="testimonial-quote">"</div>
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                <FontAwesomeIcon icon={faUserCircle} />
              </div>
              <div className="testimonial-info">
                <h3>First-Timer</h3>
                <p>Recently Joined | First Event</p>
              </div>
            </div>
            <div className="testimonial-content">
              <p>I was nervous about attending my first BodySharing event, but the pre-event orientation completely put me at ease. The facilitators were so skilled at creating a welcoming atmosphere and the consent workshop beforehand really helped me understand how to navigate the experience.</p>
              <p>What surprised me most was how non-sexual much of the experience felt. There was a focus on authentic human connection that transcended the physical aspects. I left feeling more embodied and present than I have in years. The community seems to genuinely care about creating meaningful experiences rather than just physical ones.</p>
            </div>
            <div className="testimonial-tags">
              <span className="testimonial-tag">First-Time Experience</span>
              <span className="testimonial-tag">Newcomer Perspective</span>
            </div>
          </div>
          
          <div 
            className={`testimonial-card ${!isTestimonialVisible('solo') ? 'hidden' : ''}`} 
            data-categories="solo"
          >
            <div className="testimonial-quote">"</div>
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                <FontAwesomeIcon icon={faUserTie} />
              </div>
              <div className="testimonial-info">
                <h3>Regular Attendee</h3>
                <p>Solo Explorer | 4 Years in Community</p>
              </div>
            </div>
            <div className="testimonial-content">
              <p>What keeps me coming back to BodySharing events is the rare combination of freedom and safety. In few other spaces can you explore such intimate connections while feeling completely supported by clear boundaries and attentive facilitation.</p>
              <p>Over the years, I've watched the community continuously refine its practices, always learning and evolving. The feedback system ensures that everyone's voice is heard and concerns are addressed promptly. The result is an environment where genuine human connection can flourish.</p>
            </div>
            <div className="testimonial-tags">
              <span className="testimonial-tag">Solo Attendee</span>
              <span className="testimonial-tag">Long-Term Member</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
